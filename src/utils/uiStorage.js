import store from '@src/app/store';
import { setMode, setFocusKey, removeFocusKey, clearFocusKeys } from '@src/features/uiState';

// All keys routed to Redux in-memory store (fastest path on TV hardware)
const IN_REDUX = new Set([
  // Phase 1: focus state + input mode
  'mode',
  'lastFocus', 'lastMovieFocus', 'lastFocusMenuItem',
  'lastFocusCat', 'lastCatFocus', 'lastFocusMore', 'lastFocusMoreMovie',
  'lastFocusMoreMovie_level__1', 'lastFocusMoreMovie_level__2',
  'lastFocusMore_level__1', 'lastFocusMore_level__2',
  'lastFocusRow', 'lastFocusActor', 'lastFocusCrew',
  'lastFocusRecomm', 'lastFocusMoreItem',
  'lastSeasonFocus', 'lastSeasonFocus_parent_new', 'lastSeasonFocus_season_part',
  'last',
  // NOTE: the home content cache (lastdataloaded*) and its reload-survival focus
  // keys (lastFocusRow*BeforeReload) intentionally live in real localStorage
  // (see src/containers/Home/homeCache.js) so they survive the player's
  // window.location.reload(). They must NOT be listed here.
  // Phase 2: player passthrough + UI button flags
  'movie_uid', 'movie_cast_time', 'formAction', 'fromAlert',
  'moreBtn', 'seasonBtn', 'recommBtn',
  'level', 'moreSingle', 'seriesName',
]);

export const uiStorage = {
  getItem(key) {
    if (!IN_REDUX.has(key)) return localStorage.getItem(key);
    const { ui } = store.getState();
    if (key === 'mode') return ui.mode;
    return ui.focusKeys[key] ?? null;
  },

  setItem(key, value) {
    if (!IN_REDUX.has(key)) { localStorage.setItem(key, value); return; }
    if (key === 'mode') { store.dispatch(setMode(String(value))); return; }
    store.dispatch(setFocusKey({ key, value: String(value) }));
  },

  removeItem(key) {
    if (!IN_REDUX.has(key)) { localStorage.removeItem(key); return; }
    if (key === 'mode') return;
    store.dispatch(removeFocusKey(key));
  },

  clearKeys(keys) {
    const reduxOnes = keys.filter(k => IN_REDUX.has(k) && k !== 'mode');
    const localOnes = keys.filter(k => !IN_REDUX.has(k));
    localOnes.forEach(k => localStorage.removeItem(k));
    if (reduxOnes.length) store.dispatch(clearFocusKeys(reduxOnes));
  },
};
