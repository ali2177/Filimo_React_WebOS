const HOME_NAV_KEYS = [
  "lastdataloaded",
  "lastdataloadedIran",
  "lastdataloadedMovies",
  "lastdataloadedSeries",
  "lastdataloadedKids",
  "lastFocus",
  "lastFocusMoreItem",
  "lastMovieFocus",
  "last",
  "lastFocusRow",
  "lastFocusRowMoviesBeforeReload",
  "lastFocusRowKidsBeforeReload",
  "lastFocusRowIranBeforeReload",
  "lastFocusRowBeforeReload",
];

export function clearHomeNavState() {
  HOME_NAV_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function clearActorNavState() {
  localStorage.removeItem("lastFocusActor");
  localStorage.removeItem("lastFocusCrew");
}
