import { uiStorage } from './uiStorage';

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
  uiStorage.clearKeys(HOME_NAV_KEYS);
}

export function clearActorNavState() {
  uiStorage.removeItem("lastFocusActor");
  uiStorage.removeItem("lastFocusCrew");
}
