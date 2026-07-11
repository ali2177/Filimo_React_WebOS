import { safeParse } from "./homeUtils";

// Single source of truth for the home content cache. These are large blobs
// (accumulated infinite-scroll rows) and reload-survival focus keys, so they
// live in real localStorage and must NOT be listed in uiStorage's IN_REDUX set.
export const HOME_CACHE_KEYS = [
  "lastdataloaded",
  "lastdataloadedIran",
  "lastdataloadedMovies",
  "lastdataloadedSeries",
  "lastdataloadedKids",
  "lastFocusRowBeforeReload",
  "lastFocusRowMoviesBeforeReload",
  "lastFocusRowKidsBeforeReload",
  "lastFocusRowIranBeforeReload",
  "lastFocusRowSeriesBeforeReload",
];

export function readHomeCache(cacheKey) {
  return safeParse(localStorage.getItem(cacheKey));
}

export function writeHomeCache(cacheKey, value) {
  localStorage.setItem(cacheKey, JSON.stringify(value));
}

export function clearHomeCache() {
  HOME_CACHE_KEYS.forEach((key) => localStorage.removeItem(key));
}
