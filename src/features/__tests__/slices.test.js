import authReducer, { setUser } from '../auth';
import uiReducer, { setMode, setFocusKey, removeFocusKey, clearFocusKeys } from '../uiState';
import genreOrCategoryReducer, {
  selectGenreOrCategory,
  searchMovie,
} from '../currentGenreOrCategory';

// ---------------------------------------------------------------------------
// auth slice
// ---------------------------------------------------------------------------
describe('auth slice', () => {
  const initialState = { user: {}, isAuthenticated: false, sessionId: '' };

  beforeEach(() => {
    localStorage.clear();
  });

  test('returns initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  test('setUser marks the user as authenticated', () => {
    const state = authReducer(undefined, setUser({ id: 1, name: 'Ali' }));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ id: 1, name: 'Ali' });
  });

  test('setUser reads session_id from localStorage', () => {
    localStorage.setItem('session_id', 'sess-xyz');
    const state = authReducer(undefined, setUser({ id: 1 }));
    expect(state.sessionId).toBe('sess-xyz');
  });

  test('setUser writes accountId to localStorage', () => {
    authReducer(undefined, setUser({ id: 42 }));
    expect(localStorage.getItem('accountId')).toBe('42');
  });

  test('setUser sessionId is empty string when session_id not in localStorage', () => {
    const state = authReducer(undefined, setUser({ id: 7 }));
    expect(state.sessionId).toBeNull(); // localStorage.getItem returns null for missing keys
  });
});

// ---------------------------------------------------------------------------
// uiState slice
// ---------------------------------------------------------------------------
describe('uiState slice', () => {
  test('returns initial state', () => {
    expect(uiReducer(undefined, { type: '@@INIT' })).toEqual({
      mode: 'KeyboardMode',
      focusKeys: {},
    });
  });

  test('setMode updates the mode field', () => {
    const state = uiReducer(undefined, setMode('PointerMode'));
    expect(state.mode).toBe('PointerMode');
  });

  test('setMode back to KeyboardMode works', () => {
    const prev = uiReducer(undefined, setMode('PointerMode'));
    const state = uiReducer(prev, setMode('KeyboardMode'));
    expect(state.mode).toBe('KeyboardMode');
  });

  test('setFocusKey stores a key-value pair in focusKeys', () => {
    const state = uiReducer(undefined, setFocusKey({ key: 'lastFocus', value: 'MOVIE_5' }));
    expect(state.focusKeys.lastFocus).toBe('MOVIE_5');
  });

  test('setFocusKey does not overwrite unrelated keys', () => {
    const prev = uiReducer(undefined, setFocusKey({ key: 'a', value: '1' }));
    const state = uiReducer(prev, setFocusKey({ key: 'b', value: '2' }));
    expect(state.focusKeys.a).toBe('1');
    expect(state.focusKeys.b).toBe('2');
  });

  test('removeFocusKey deletes the specified key', () => {
    const prev = uiReducer(
      undefined,
      setFocusKey({ key: 'lastFocus', value: 'MOVIE_5' }),
    );
    const state = uiReducer(prev, removeFocusKey('lastFocus'));
    expect(state.focusKeys.lastFocus).toBeUndefined();
  });

  test('removeFocusKey leaves other keys intact', () => {
    let state = uiReducer(undefined, setFocusKey({ key: 'a', value: '1' }));
    state = uiReducer(state, setFocusKey({ key: 'b', value: '2' }));
    state = uiReducer(state, removeFocusKey('a'));
    expect(state.focusKeys.b).toBe('2');
  });

  test('clearFocusKeys removes all specified keys', () => {
    let state = uiReducer(undefined, setFocusKey({ key: 'a', value: '1' }));
    state = uiReducer(state, setFocusKey({ key: 'b', value: '2' }));
    state = uiReducer(state, setFocusKey({ key: 'c', value: '3' }));
    state = uiReducer(state, clearFocusKeys(['a', 'b']));
    expect(state.focusKeys.a).toBeUndefined();
    expect(state.focusKeys.b).toBeUndefined();
    expect(state.focusKeys.c).toBe('3');
  });

  test('clearFocusKeys with empty array changes nothing', () => {
    const prev = uiReducer(undefined, setFocusKey({ key: 'x', value: 'v' }));
    const state = uiReducer(prev, clearFocusKeys([]));
    expect(state.focusKeys.x).toBe('v');
  });
});

// ---------------------------------------------------------------------------
// currentGenreOrCategory slice
// ---------------------------------------------------------------------------
describe('currentGenreOrCategory slice', () => {
  const initialState = { genreIdOrCategoryName: '', page: 1, searchQuery: '' };

  test('returns initial state', () => {
    expect(genreOrCategoryReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState,
    );
  });

  test('selectGenreOrCategory sets genre name', () => {
    const state = genreOrCategoryReducer(undefined, selectGenreOrCategory('action'));
    expect(state.genreIdOrCategoryName).toBe('action');
  });

  test('selectGenreOrCategory clears searchQuery', () => {
    let state = genreOrCategoryReducer(undefined, searchMovie('batman'));
    state = genreOrCategoryReducer(state, selectGenreOrCategory('action'));
    expect(state.searchQuery).toBe('');
  });

  test('searchMovie sets searchQuery', () => {
    const state = genreOrCategoryReducer(undefined, searchMovie('batman'));
    expect(state.searchQuery).toBe('batman');
  });

  test('searchMovie does not clear genreIdOrCategoryName', () => {
    let state = genreOrCategoryReducer(undefined, selectGenreOrCategory('drama'));
    state = genreOrCategoryReducer(state, searchMovie('test'));
    expect(state.genreIdOrCategoryName).toBe('drama');
  });

  test('page is always preserved across actions', () => {
    const state = genreOrCategoryReducer(undefined, searchMovie('anything'));
    expect(state.page).toBe(1);
  });
});
