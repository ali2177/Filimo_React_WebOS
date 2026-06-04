# Filimo Tizen App — Improvement Checklist

**Overall Score: 6.5 / 10**

| Dimension | Score |
|---|---|
| Performance | 7 / 10 |
| Architecture | 6.5 / 10 |
| File Structure | 6.5 / 10 |
| Code Quality | 6 / 10 |
| Testing | 4.5 / 10 |
| Error Handling | 5 / 10 |
| Security | 4 / 10 |
| TV / Accessibility | 6 / 10 |

---

## P0 — Correctness / Crashes

- [ ] **Add error boundaries** — wrap at route level and around the player. Any React render error currently crashes the whole app to a white screen.
- [ ] **Fix missing `key` props in `ContentOnlyRow.jsx` ~line 137** — the `<div>` wrapping `<MovieRecoom>` inside `.map()` has no `key`. Causes focus loss and potential memory leaks on TV.

---

## P1 — Performance

- [ ] **Memoize `.slice()` in all `Content*Row` components** — `.slice()` creates a new array on every render; wrap in `useMemo` keyed on the movies array. Affects: `ContentRow`, `ContentMoreRow`, `ContentOnlyRow`, `ContentCatRow`, `ContentActorProfileRow`, `ContentCrewRow`.
- [ ] **Remove `setTimeout(..., 10)` on every focus** — `Movie.jsx:119` and `MoreItem.jsx:83` queue a microtask on every D-pad keypress. Use `useLayoutEffect` or eliminate.
- [ ] **Cache repeated `localStorage.getItem` calls** — `MoreItem.jsx` reads `"level"` 4× in one handler. Assign to a `const` once at the top.
- [ ] **Move inline arrow functions in `Movie.jsx` to `useCallback`** — `onMouseEnter` and `onError` are inline, defeating `React.memo`.

---

## P2 — Architecture

- [ ] **Remove `axios`; use RTK Query everywhere** — `src/utils/index.js` has an axios instance alongside RTK Query's `fetchBaseQuery`. Pick one.
- [ ] **Replace hardcoded route string slicing in `App.jsx`** — `location.pathname.slice(0, 7)` is fragile. Extract route path constants and use `startsWith` or `matchPath`.
- [ ] **Create `src/constants/player.js`** — magic numbers `5000`, `10000`, `15`, `100` are scattered inline across player hooks.
- [ ] **Rename `src/services/TMDB.js` → `filimo.js`** — the file is the Filimo API, not TMDB. Confusing for any new contributor.
- [ ] **Add error handling to RTK Query endpoints** — API failures are currently silent. Add `transformErrorResponse` or a `baseQuery` wrapper with retry logic.
- [ ] **Adopt TypeScript incrementally** — start with `CustomPLayer/hooks/*.ts` and `services/filimo.ts` where typed contracts matter most.

---

## P3 — Security

- [ ] **Add JWT expiry check in `AuthProvider.jsx`** — stale tokens silently fail today. Parse the JWT payload on load and clear if expired.
- [ ] **Add token refresh logic** — there is no mechanism to renew the session. Add a refresh call before the token expires.
- [ ] **(Future) Move JWT to `httpOnly` cookie** — if the Filimo API supports it, eliminates XSS exposure entirely.

---

## P4 — Code Quality / Maintainability

- [ ] **Delete 100+ lines of commented-out code** — large blocks in `ContentMoreRow.jsx` and `ContentCatRow.jsx`. Git history preserves them.
- [ ] **Split `src/utils/index.js` (184 lines)** — break into `axiosInstance.js` (or remove), `menuConfig.js`, and a smaller `helpers.js`.
- [ ] **Route all localStorage key strings through `storageKeys.js`** — the file exists in `src/utils/` but many components bypass it with raw string literals.
- [ ] **Fix naming inconsistencies** — `CustomPLayer` (typo), `Loogin` folder, `TMDB.js` — rename to reduce onboarding confusion.
- [ ] **Extract duplicate image JSX in `Movie.jsx`** — the same 60-line conditional image block is written twice. Pull into a local `<MovieImage>` function.

---

## P5 — Testing

- [ ] **Add Redux slice reducer unit tests** — `auth.js`, `uiState.js`, `currentGenreOrCategory.js` are trivial to test and high value.
- [ ] **Add RTK Query endpoint shape tests** — verify the API response shape is parsed correctly.
- [ ] **Add at least one render test per container** — `Home`, `MovieInfo`, `Search` have zero tests.
- [ ] **Add one Playwright / Cypress E2E smoke test** — login → browse → click a movie. Catches the most common regressions.

---

## P6 — Error Handling

- [ ] **Replace silent `.catch(() => {})` with logging** — add Sentry or a simple logger so production errors are visible.
- [ ] **Add `transformErrorResponse` in RTK Query** — surface API errors to the UI instead of swallowing them.
- [ ] **Add timeout to `useFilimioFetch`** — fetch calls have no timeout; a hung request blocks the UI indefinitely.

---

## P7 — Accessibility

- [ ] **Add `aria-label` to all icon-only buttons** — `PlayIcon`, `PauseIcon`, etc. have no text alternative.
- [ ] **Replace `<div onClick>` with `<button>`** for interactive controls — gets keyboard focus and semantics for free.
- [ ] **Add `aria-live="polite"` to error overlays** — screen readers won't announce the Persian error text without it.

---

## Things to Add (Missing Features)

- [ ] **Sentry or equivalent error aggregation** — currently flying blind on production crashes.
- [ ] **`i18n` framework (e.g. `react-i18next`)** — all Persian strings are hardcoded; impossible to test or change systematically.
- [ ] **React DevTools profiler baseline** — measure frame rate and re-render count on real TV hardware before and after optimisations.
- [ ] **Route-level lazy loading for heavy pages** — `MovieInfo` and `Search` are eagerly bundled; split them.

---

## What's Already Excellent (Don't Break It)

- Custom HLS player hook architecture (`CustomPLayer/hooks/`)
- `useVideoTime.js` throttled time updates — only fires on second changes, not every frame
- `useSubtitles.js` segment prefetching — 2 segments ahead, keeps timeupdate handler compute-free
- `uiStorage.js` hybrid Redux/localStorage routing — fast in-memory for focus, persistent for cold data
- Spatial navigation focus trapping in modals (`isFocusBoundary`)
- 72 player unit tests covering hooks and utilities
