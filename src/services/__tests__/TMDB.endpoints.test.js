import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi } from '../TMDB';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeStore = () =>
  configureStore({
    reducer: { [tmdbApi.reducerPath]: tmdbApi.reducer },
    middleware: (gDM) => gDM().concat(tmdbApi.middleware),
  });

// Extract the called URL regardless of whether fetch received a string or
// a Request object (RTK Query passes a Request in some environments).
function lastFetchUrl() {
  const calls = global.fetch.mock.calls;
  if (!calls.length) return null;
  const arg = calls[calls.length - 1][0];
  return typeof arg === 'string' ? arg : arg?.url ?? null;
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: [] }),
      clone: () => ({ json: () => Promise.resolve({ data: [] }) }),
      headers: { get: () => 'application/json' },
    }),
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Hook exports (shape test)
// ---------------------------------------------------------------------------

describe('tmdbApi exported hooks', () => {
  test('all expected query hooks are functions', () => {
    const {
      useGetMoviesQuery,
      useGetMovieQuery,
      useGetMenuQuery,
      useGetLoginCodeQuery,
      useGetMovieDetailQuery,
      useGetAllEpisodesQuery,
      useGetUsersProfileQuery,
    } = require('../TMDB');
    [
      useGetMoviesQuery,
      useGetMovieQuery,
      useGetMenuQuery,
      useGetLoginCodeQuery,
      useGetMovieDetailQuery,
      useGetAllEpisodesQuery,
      useGetUsersProfileQuery,
    ].forEach((hook) => expect(hook).toBeInstanceOf(Function));
  });
});

// ---------------------------------------------------------------------------
// URL builder tests
// ---------------------------------------------------------------------------

describe('getMovies endpoint URL', () => {
  test('with tag_id and other_data builds filtered URL', async () => {
    const store = makeStore();
    await store.dispatch(
      tmdbApi.endpoints.getMovies.initiate({ tag_id: '123', other_data: 'action' }),
    );
    expect(lastFetchUrl()).toContain('/movie/movie/list/tagid/123/other_data/action/');
  });

  test('with other_data=kids uses the kids shorthand URL', async () => {
    const store = makeStore();
    await store.dispatch(
      tmdbApi.endpoints.getMovies.initiate({ other_data: 'kids' }),
    );
    expect(lastFetchUrl()).toContain('/movie/movie/list/tagid/kids/');
  });

  test('without tag_id falls back to default paginated URL', async () => {
    const store = makeStore();
    await store.dispatch(
      tmdbApi.endpoints.getMovies.initiate({}),
    );
    expect(lastFetchUrl()).toContain('movie/movie/list/tagid/1/list_perpage/9/list_offset/0/');
  });
});

describe('getMovie endpoint URL', () => {
  test('builds uid URL with the provided id', async () => {
    const store = makeStore();
    await store.dispatch(tmdbApi.endpoints.getMovie.initiate({ id: '456' }));
    expect(lastFetchUrl()).toContain('/movie/movie/one/uid/456/');
  });
});

describe('getMenu endpoint URL', () => {
  test('calls the sidepanel menu endpoint', async () => {
    const store = makeStore();
    await store.dispatch(tmdbApi.endpoints.getMenu.initiate());
    expect(lastFetchUrl()).toContain('menu/menu/sidepanel');
  });
});

describe('getLoginCode endpoint URL', () => {
  test('without code calls the base get-code URL', async () => {
    const store = makeStore();
    await store.dispatch(tmdbApi.endpoints.getLoginCode.initiate({}));
    expect(lastFetchUrl()).toContain('/login/get-code');
  });

  test('with code calls the sync-code URL', async () => {
    const store = makeStore();
    await store.dispatch(
      tmdbApi.endpoints.getLoginCode.initiate({ code: 'ABC123' }),
    );
    expect(lastFetchUrl()).toContain('/login/get-code/api/login/sync-code/ABC123');
  });
});

describe('getAllEpisodes endpoint URL', () => {
  test('builds allepisode URL with the provided uid', async () => {
    const store = makeStore();
    await store.dispatch(tmdbApi.endpoints.getAllEpisodes.initiate('789'));
    expect(lastFetchUrl()).toContain('/movie/serial/allepisode/uid/789/');
  });
});

describe('rateMovie / toggleBookmark mutations', () => {
  test('rateMovie forwards the response-provided url unchanged', async () => {
    const store = makeStore();
    const url =
      'https://www.filimo.com/api/fa/v1/movie/rate/add/rate/5/uid/bmwcd';
    await store.dispatch(tmdbApi.endpoints.rateMovie.initiate({ url }));
    expect(lastFetchUrl()).toBe(url);
  });

  test('toggleBookmark forwards the response-provided url unchanged', async () => {
    const store = makeStore();
    const url = 'https://www.filimo.com/api/fa/v1/user/wish/wish/uid/rn0ba';
    await store.dispatch(tmdbApi.endpoints.toggleBookmark.initiate({ url }));
    expect(lastFetchUrl()).toBe(url);
  });
});

describe('request headers', () => {
  test('includes UserAgent header on every request', async () => {
    const store = makeStore();
    await store.dispatch(tmdbApi.endpoints.getMenu.initiate());
    const [arg] = global.fetch.mock.calls[0];
    // Resolve headers whether fetch got a Request object or a plain init object
    const headers = arg?.headers ?? global.fetch.mock.calls[0][1]?.headers;
    const ua = typeof headers?.get === 'function'
      ? headers.get('UserAgent')
      : headers?.UserAgent;
    const parsed = JSON.parse(ua);
    expect(parsed).toMatchObject({ os: 'WebOs', an: 'Filimo', vn: '1.00' });
  });

  test('includes Authorization header when jwt is in localStorage', async () => {
    localStorage.setItem('jwt', 'test-token-123');
    const store = makeStore();
    await store.dispatch(tmdbApi.endpoints.getMenu.initiate());
    const [arg] = global.fetch.mock.calls[0];
    const headers = arg?.headers ?? global.fetch.mock.calls[0][1]?.headers;
    const auth = typeof headers?.get === 'function'
      ? headers.get('Authorization')
      : headers?.Authorization;
    expect(auth).toBe('Bearer test-token-123');
  });

  test('does not include Authorization header when jwt is absent', async () => {
    const store = makeStore();
    await store.dispatch(tmdbApi.endpoints.getMenu.initiate());
    const [arg] = global.fetch.mock.calls[0];
    const headers = arg?.headers ?? global.fetch.mock.calls[0][1]?.headers;
    const auth = typeof headers?.get === 'function'
      ? headers.get('Authorization')
      : headers?.Authorization;
    expect(auth).toBeFalsy();
  });
});
