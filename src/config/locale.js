// Single source of truth for the app's language / API locale.
//
// Language is "boot-time-only" state: it only changes via a full
// window.location.reload() (see the Settings language toggle), so every module
// re-derives it fresh on load. That's why it lives in plain localStorage
// (like `jwt` / `kids-Lock`) rather than Redux/Context — see src/utils/uiStorage.js.

export const SUPPORTED_LANGUAGES = ["fa", "en"];
export const DEFAULT_LANGUAGE = "fa";

const STORAGE_KEY = "language";

/** Current UI language, validated. Falls back to DEFAULT_LANGUAGE. */
export function getLanguage() {
  try {
    const lang = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

/** Persist a new language (validated). Caller is responsible for reloading. */
export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * API locale path segment. Today it equals the UI language 1:1, but it's kept
 * separate so the two can diverge later (e.g. `en-US` UI vs `en` API).
 */
export function getApiLocale() {
  return getLanguage();
}

/** Base URL for the Filimo REST API, with the current locale baked into the path. */
export function getApiBaseUrl() {
  return `https://www.filimo.com/api/${getApiLocale()}/v1/`;
}

/** Build a full API URL from a path, tolerating a leading slash on `path`. */
export function buildApiUrl(path = "") {
  return `${getApiBaseUrl()}${String(path).replace(/^\//, "")}`;
}

/** Whether the given language (default: current) is right-to-left. */
export function isRtl(lang = getLanguage()) {
  return lang === "fa";
}
