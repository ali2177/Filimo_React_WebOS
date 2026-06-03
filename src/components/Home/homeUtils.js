export const STORAGE_KEYS_TO_CLEAR_ON_ENTER = [
  "searchQuery",
  "searchResult",
  "level",
  "lastCatFocus",
  "lastFocusMore",
  "last",
  "lastFocusActor",
  "lastFocusCrew",
  "lastFocusRecomm",
  "lastFocusCat",
  "lastFocusMoreMovie_level__1",
  "lastFocusMoreMovie_level__2",
  "lastFocusMore_level__1",
  "lastFocusMore_level__2",
  "seasonBtn",
  "recommBtn",
  "moreBtn",
  "lastSeasonFocus",
  "lastSeasonFocus_parent_new",
  "lastSeasonFocus_season_part",
  "movie_cast_time",
  "movie_uid",
  "fromAlert",
];

export const PAGE_TYPE_CONFIG = {
  home: {
    cacheKey: "lastdataloaded",
    focusRowBeforeReloadKey: "lastFocusRowBeforeReload",
  },
  series: {
    cacheKey: "lastdataloadedSeries",
    focusRowBeforeReloadKey: "lastFocusRowSeriesBeforeReload",
  },
  movie: {
    cacheKey: "lastdataloadedMovies",
    focusRowBeforeReloadKey: "lastFocusRowMoviesBeforeReload",
  },
  iran: {
    cacheKey: "lastdataloadedIran",
    focusRowBeforeReloadKey: "lastFocusRowIranBeforeReload",
  },
  kids: {
    cacheKey: "lastdataloadedKids",
    focusRowBeforeReloadKey: "lastFocusRowKidsBeforeReload",
  },
};

export function getPageType(pathname) {
  if (pathname === "/") return "home";
  if (pathname.includes("/series")) return "series";
  if (pathname.includes("/movie")) return "movie";
  if (pathname.includes("/iran")) return "iran";
  if (pathname.includes("/kids")) return "kids";
  return "other";
}

export function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
