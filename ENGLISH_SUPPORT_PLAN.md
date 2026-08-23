# English-language support for Filimo WebOS

## Context

The user asked ChatGPT how to add English support to this Farsi/RTL-only WebOS app, and got a 10-step generic i18n migration list. Comparing that list against this codebase surfaced two gaps ChatGPT couldn't have known about:

1. **The `fa` locale isn't an API query param — it's a URL path segment (`/api/fa/v1/`) duplicated across 14+ files.** `src/services/TMDB.js` has one `baseUrl`, but ~13 other containers bypass RTK Query with raw `fetch()` calls that each hardcode the same literal path. The user confirmed the backend already returns English field values when `fa` is swapped for `en` in the path — so the backend side works today; the app just needs to drive it consistently instead of duplicating the locale everywhere.
2. **A live correctness bug that breaks regardless of translation progress**: `src/containers/MovieInfo/MovieInfo.jsx:310-333` branches on the API's human-readable `watch_action.link_text` field (e.g. `"تمدید اشتراک"`) instead of the stable `watch_action.type` field it already uses elsewhere in the same function. Once the API localizes that field for English users, this comparison silently fails. The same bug class exists in `src/components/Sidebar/MenuItems.jsx:39-45` (`link_text === "کودک"`).

Given the actual scope discovered during research — 61 of 186 files carry hardcoded Farsi (~725 string literals), ~163 RTL-positional CSS declarations with no logical properties anywhere, no i18n library installed — translating everything in one pass is too large and risky to do blind.

## Phasing (why this order)

The work is split into four sequential phases. **Do not interleave them.** Phase 1 is the foundation: prove the locale plumbing (reload-on-toggle, `rtl` re-init, `<html dir>`, centralized API base URL) works end-to-end on 1-2 screens before committing to the volume work. If the spatial-nav `rtl` flip or the reload misbehaves on real TV hardware, that should surface after touching ~10 files, not ~60.

- **Phase 1 — Foundation (this pass):** i18n library + locale plumbing + language toggle + the two correctness bug fixes + two proof-of-concept screens. After this you have a working toggle and a proven pipeline, but the English UI is **not yet visually correct** on legacy screens (see Phase 2).
- **Phase 2 — CSS logical properties:** the real gate for shippable English. Until the ~163 physical CSS declarations become logical, every un-converted screen still *looks* RTL in English regardless of translation.
- **Phase 3 — String translation sweep:** mechanical, screen-by-screen, once the pipeline is trusted.
- **Phase 4 — Tail cleanups.**

"Later phase" here means *sequenced after*, not *optional* — Phases 2 and 3 are both required before English is genuinely shippable.

## Key design decisions

**Language changes trigger a full `window.location.reload()`, not in-place hot-swapping.** This was verified by reading `node_modules/@noriginmedia/norigin-spatial-navigation/dist/index.js`: `init()` is guarded by `this.enabled ||`, so it silently no-ops on a second call — there is no supported way to flip `rtl` at runtime without `destroy()` (which wipes the focus registry) plus remounting every `useFocusable()` consumer. The app already uses `window.location.reload()` as an established pattern for major state transitions (`TvPlayer.jsx`, `NextEpisodesItem.jsx`), so language becomes "boot-time-only" state: persist to `localStorage`, reload, and every module (spatial-nav init, `<html>` attributes, i18next, API base URL) re-derives itself fresh on the next load.

**Accepted cost of the reload:** the Redux-backed `lastFocus*` / `mode` state in `uiState` is in-memory and is wiped on reload, so toggling language drops the user out of the Settings screen and back at app boot (Home). This is acceptable for a one-off settings action — but it is a real UX consequence, not a no-op, and is called out here deliberately.

**No Redux slice or Context for language** — since it only changes via reload, it's read directly via plain `localStorage` calls, exactly like the existing `jwt` and `kids-Lock` keys (see `src/utils/uiStorage.js`, which documents that reload-surviving keys must stay in real `localStorage`, not the Redux-routed set).

**The Phase 1 PoC proves plumbing, not layout — and that limitation is up front, not buried.** All styling lives in one shared `src/app/App.css` (~1800 lines) built entirely from *physical* CSS properties (`margin-right`, `right:`, `text-align: right`, `direction: rtl`), none of which respond to `<html dir="ltr">`. So after Phase 1, strings, API data, `<html lang/dir>`, and remote-navigation direction all flip correctly, but legacy screens' visual layout will still read right-to-left until Phase 2. Phase 1 converts only the small, self-contained `.alert*` / `.infoo*` block (`App.css:909-990`) so there is one genuinely-correct end-to-end English screen to demo.

---

# Phase 1 — Foundation (this pass)

**1.0 Dependencies** — `npm install i18next react-i18next`. Skip `i18next-browser-languagedetector` and `i18next-http-backend`: our own `localStorage` key is already the single source of truth, and the Phase 1 string set is small enough to bundle statically.

**1.1 Centralize locale — `src/config/locale.js` (new file, everything else depends on it)**
- `SUPPORTED_LANGUAGES = ['fa', 'en']`, `DEFAULT_LANGUAGE = 'fa'`
- `getLanguage()` / `setLanguage(lang)` — read/write `localStorage.getItem/setItem('language', ...)`, validated against `SUPPORTED_LANGUAGES`
- `getApiLocale()` — today returns `getLanguage()` 1:1, kept separate in case UI language and API locale code ever diverge
- `getApiBaseUrl()` → `` `https://www.filimo.com/api/${getApiLocale()}/v1/` ``
- `buildApiUrl(path)` — for the raw-`fetch` call sites
- `isRtl(lang = getLanguage())` → `lang === 'fa'`

**1.2 Refactor `src/services/TMDB.js`**
- Replace the hardcoded `baseUrl: "https://www.filimo.com/api/fa/v1/"` with `baseUrl: getApiBaseUrl()`.
- Add a locale-aware `serializeQueryArgs` to `createApi({...})` so cached queries don't leak across language contexts. Wrap RTK Query's own `defaultSerializeQueryArgs` rather than hand-rolling `JSON.stringify` (which doesn't guarantee stable object-key ordering):
  ```js
  import { createApi, fetchBaseQuery, defaultSerializeQueryArgs } from "@reduxjs/toolkit/query/react";
  // ...
  serializeQueryArgs: (args) => `${getApiLocale()}-${defaultSerializeQueryArgs(args)}`,
  ```
  Note: because the toggle reloads the page (wiping RTK Query's in-memory cache), this is defense-in-depth against future non-reload code paths, not a fix for an active bug today — but it's one line and matches the user's "include language in cache keys" intent.

**1.3 Refactor the 13 raw hardcoded-URL call sites** to use `buildApiUrl()`/`getApiBaseUrl()` instead of the literal `/fa/` path, preserving existing behavior exactly (including the pre-existing `devicetype=tizen_react` vs `react_tizen` inconsistency in `TvPlayer.jsx:123` — don't silently "fix" that, it's out of scope):
`src/app/App.jsx:86`, `AllEpisodes/EpisodesWrapper.jsx:61`, `Search/SearchAction.jsx:36`, `Search/Search.jsx:68`, `UsersProfile/User.jsx:71,93`, `Profile/Profile.jsx:45`, `Profile/SignOutBtn.jsx:54`, `MovieInfo/MovieInfo.jsx:129`, `Login/Loogin.jsx:64,95`, `Player/LivePlayer.jsx:94`, `Player/TvPlayer.jsx:123`.
After this, `grep -rn "filimo.com/api/fa/v1" src/` should only match the static fixture `src/app/home-api-response.json` (leave it alone).

**1.4 Reactive `<html>` attributes and spatial-nav `rtl`**
- In `src/index.js`, before `root.render(...)`: read `getLanguage()`/`isRtl()` and set `document.documentElement.lang` / `.dir` synchronously (no FOUC — `localStorage` is sync). Leave `public/index.html`'s static `lang="fa" dir="rtl"` as the pre-JS fallback matching `DEFAULT_LANGUAGE`.
- In `src/app/App.jsx`, change `init({ debug: false, rtl: true })` to `init({ debug: false, rtl: isRtl() })`. Because this runs once per fresh page load and the reload-based design guarantees a fresh module evaluation on every language change, this is sufficient — do not attempt a runtime `destroy()`+`init()` call (see Key design decisions above).

**1.5 Bootstrap react-i18next**
- `src/locales/fa/common.json` and `src/locales/en/common.json`, keyed by screen (`settings.*`, `alert.*`).
- `src/app/i18n.js` — `i18next.use(initReactI18next).init({ resources: { fa: { common: fa }, en: { common: en } }, lng: getLanguage(), fallbackLng: 'fa', defaultNS: 'common', interpolation: { escapeValue: false } })`.
- Import `./app/i18n` once for its side effect near the top of `src/index.js`, alongside step 1.4's `<html>`-attribute code.

**1.6 Settings entry point + Settings page (repurpose the API's existing `settings` menu item)**

The menu API already returns a `link_type: "settings"` item (id 5, `position: "bottom-right"`, gear `link_icon`/`link_icon_h`, `link_text` = app version e.g. "۱.۰۰"). It's currently filtered out in **three** places — un-filter it and wire it as a real bottom-of-sidebar Settings button:

- **`src/components/Sidebar/MenuItems.jsx`:** remove `link_type !== "settings"` from the `filteredMenu` filter (line ~92) AND from the identical filter inside the home-focus `findIndex` (line ~36). Keep excluding `subscribe` and `mycontent`. To honor the API's `position: "bottom-right"`, split the list: render non-settings items as today, then render the settings item as a separate element pinned to the bottom of `.menu-items` (flex-column + `margin-block-start: auto` on the settings wrapper, using logical properties). Reuse the existing `SidebarItem` component unchanged — it already renders `link_icon`/`link_icon_h` + `link_text`, so the gear icon and version label come straight from the API (no new asset, and the label is intentionally the version string, matching the screenshots).
- **`src/components/Sidebar/SidebarItem.jsx`:** remove `link_type !== "settings"` from its internal `findIndex` filter (lines ~35-36) so indices stay consistent.
- Add navigation: in `handleInterPress`, add `if (item.link_type === "settings") navigate("/settings");` and add a `getIsActive` case (`if (link_type === "settings") return pathname === "/settings";`).
- **`src/app/routes.jsx`:** add `const Settings = React.lazy(() => import('@containers/Settings/Settings'));` and `<Route path="/settings" element={<Settings />} />`.
- **`src/app/App.jsx`:** add `location.pathname.slice(0, 7) === "/settin"` to the menu-hide `if` chain (lines ~54-73), so Settings is full-screen like Profile. (Choice, not forced — matches the existing Profile pattern; note it explicitly.)
- **New `src/containers/Settings/Settings.jsx`:** a simple focusable page authored in i18next from the start. For this foundation pass it needs only the **language toggle** row; structure it so more settings rows can be added later. Follow the `useFocusable`/`FocusContext` pattern used by other containers, and mirror `Profile.jsx`'s back-navigation/remote handling.

**Language toggle behavior** (the toggle row inside the Settings page):
```js
const nextLang = getLanguage() === "fa" ? "en" : "fa";
setLanguage(nextLang);
window.location.reload();
```
No dispatch/Context needed — the reload re-derives everything (per the design decisions).

Note: I could not locate a current render site for the "نسخه ۲.۱.۰" version label in the sidebar code (the `settings` item is filtered out everywhere I found), so treat the screenshots as the desired end state; the mechanism to deliver it is un-filtering + bottom-pinning the API item as described above.

**1.7 Proof-of-concept translations on two screens**
- **Settings page (new, greenfield — from step 1.6):** the language toggle lives here, and because we author the whole screen fresh in both `fa`/`en` via i18next from the start, it's the cleanest possible demonstration of the pipeline — no legacy hardcoded strings to untangle. (Translating the existing Profile screen moves to the Phase 3 sweep — it no longer needs to change in this pass since the toggle isn't there anymore.)
- **Alert** (`src/components/Alert/Alert.jsx`, `AlertBtn.jsx`): 4 message strings + 1 button label, directly exercised by the MovieInfo bug fix in step 1.9 — translating it lets you verify both copy and trigger logic in English together, and it's the one legacy screen we make visually correct in LTR (step 1.8).
- Provide real (machine-translated) English copy for both, not lorem-ipsum placeholders, per the user's preference.

**1.8 Convert the Alert CSS block to logical properties (`App.css:909-990`)** — so at least one screen is visually correct end-to-end in English (a small preview of the Phase 2 pattern). Swap the physical properties in the `.alert*` / `.infoo*` / `.alert-network` / `.alert-content` / `.alert-bnt*` / `.alert-icon` rules for logical equivalents (`margin-right`→`margin-inline-end`, `right:`→`inset-inline-end:`, `text-align: right`→`text-align: start`, drop/neutralize any hardcoded `direction: rtl`). Do NOT attempt the rest of `App.css` here (that's Phase 2). Verify the Alert box still looks correct in Farsi/RTL after the swap (logical properties should be a no-op visually in RTL).

**1.9 Fix the two `link_text` string-match bugs (both are pulled into Phase 1 because both break core flows the moment the API localizes)**

*a) `src/containers/MovieInfo/MovieInfo.jsx` (lines 299-339)* — confirmed via `Alert.jsx` that all four `link_text`-matched branches (310-333) do the exact same thing (`setIsShowAlert(true); setFocus("Alert-btn")`) — a duplicated, Farsi-string-keyed catch-all, not four distinct behaviors. Collapse to:
```js
if (movieData?.data?.watch_action.type === "watch") { /* existing */ return; }
if (movieData?.data?.watch_action.type === "login") { navigate("/login"); return; }
// Anything else (pay, movie_rent, or any other non-watchable state) shows the alert.
if (isShowAlert) return;
setIsShowAlert(true);
setFocus("Alert-btn");
```
Behavior is preserved for every case the current code actually handles (`pay` and the four `link_text` states all converge on show-alert today). **One intentional change to flag:** for any *unrecognized* `watch_action.type` whose `link_text` previously matched nothing, the old code did nothing and the new code shows the alert — a deliberate improvement (fail-visible instead of a dead button); add a one-line code comment. Also add the missing `return` after `navigate("/login")` so the login case no longer falls through into the alert logic.

*b) `src/components/Sidebar/MenuItems.jsx` (lines 39-45)* — same bug class: `item.link_text === "کودک"` gates the Kids-profile focus-restoration target (`MOVIE_1__0` vs `MOVIE_0__0`), and breaks the instant the label localizes to English. Replace the `link_text === "کودک"` comparison with the stable `link_key === "kids"` field (already used for navigation in the same file at line ~76). Pulled into Phase 1 rather than deferred because it's the same fix pattern as (a), it's cheap, and it silently breaks a core navigation flow for English users.

## Phase 1 verification

1. `npm start`, open the sidebar, confirm the gear/version **Settings** item now appears at the bottom of the menu, is focusable with the remote, and navigates to `/settings` (menu hidden, full-screen). Toggle language there in both directions; confirm the page reloads and `<html lang/dir>` flips correctly.
2. Confirm spatial-nav remote navigation still works in both directions after a reload (up/down/left/right on the TV remote / arrow keys), including reaching the new bottom-pinned Settings item.
3. Confirm API responses (movie titles, menu labels, `watch_action.link_text`) come back in English when the `en` locale is active — verify via network tab that request URLs now hit `/api/en/v1/`.
4. Confirm the Settings and Alert screens show the translated strings in English mode and original Farsi in Farsi mode. **Expect the new Settings page and the Alert box to be visually correct in both directions (Settings is greenfield; Alert gets step 1.8); expect other legacy screens to still read RTL-ish in English** — that's the known, accepted Phase 1 limitation (fixed in Phase 2).
5. Confirm the pay/rent alert in MovieInfo still triggers correctly in an English session, and that navigating to Kids content still restores focus correctly (both `link_text` bug fixes).
6. `npm run build` — confirm the production build compiles with the new deps and `serializeQueryArgs`/import changes.
7. `npm test` — the existing 72-test suite (all in CustomPLayer) shouldn't be affected, but run it to confirm no regressions from the `TMDB.js`/`App.jsx` changes.

---

# Phase 2 — CSS logical properties (required for shippable English)

The real gate: ~163 physical CSS declarations across `App.css` (24 CSS files total) that ignore `<html dir>`. Until converted, English screens still read RTL.

- Systematic conversion, ideally codemod-assisted: `margin-left/right` → `margin-inline-start/end`, `padding-left/right` → `padding-inline-start/end`, positional `left/right:` → `inset-inline-start/end:`, `text-align: right/left` → `start/end`, `border-left/right` → `border-inline-start/end`, `float: left/right` → `inline-start/end`. Remove or make conditional the hardcoded `direction: rtl`/`ltr` switches (`App.css:333, 375, 1458`).
- After conversion, physical properties should survive only where they are genuinely direction-independent (e.g. `top`, `bottom`, a watermark that should stay visually pinned regardless of language).
- Verify every screen looks correct in **both** `fa` (RTL) and `en` (LTR) — logical properties must be a visual no-op in RTL relative to today.

# Phase 3 — String translation sweep

~700 hardcoded Farsi string literals across ~59 remaining files (`src/components` 31, `src/containers` 29, `src/utils/index.js` 1).

- Extract screen-by-screen into `common.json` (or per-namespace files) and replace inline literals with `t()` calls, verifying each screen in English as you go.
- Includes the existing Profile screen (`Profile.jsx`, `SignOutBtn.jsx`, `UserManegBtn.jsx`), the nav config labels in `src/utils/index.js`, the player sheets under `CustomPLayer/`, and the rest.
- Watch for more `link_text`/label-as-comparison-key cases while sweeping (same bug class as step 1.9) — fix them to stable keys rather than translating the comparison.

# Phase 4 — Tail cleanups

- Make `toFarsiDigits` (`src/components/CustomPLayer/utils/toFarsiDigits.js`, 4 call sites) conditional on language — currently unconditional, so English sessions still show Persian digits (۰۱:۲۳) in the player/season counts.
- `Alert.jsx` has no fallback message text for `watch_action.type` values outside `error`/`movie_rent`/`pay` — give it a generic default now that step 1.9a can route more `type` values to it.
- Adopt `i18next-http-backend` for lazy-loaded translation bundles — revisit once the full Phase 3 catalog exists and bundle size matters.
