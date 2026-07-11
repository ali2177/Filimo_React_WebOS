import { uiStorage } from './uiStorage';
import { HOME_CACHE_KEYS } from '@src/containers/Home/homeCache';

const HOME_NAV_KEYS = [
  // Content cache + reload-survival focus keys (localStorage, single source of
  // truth in homeCache.js — includes lastdataloaded* and lastFocusRow*BeforeReload).
  ...HOME_CACHE_KEYS,
  "lastFocus",
  "lastFocusMoreItem",
  "lastMovieFocus",
  "last",
  "lastFocusRow",
];

export function clearHomeNavState() {
  uiStorage.clearKeys(HOME_NAV_KEYS);
}

export function clearActorNavState() {
  uiStorage.removeItem("lastFocusActor");
  uiStorage.removeItem("lastFocusCrew");
}
