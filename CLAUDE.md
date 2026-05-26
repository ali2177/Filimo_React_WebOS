# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start dev server (Create React App)
npm run build      # Production build
npm test           # Run test suite (72 tests, all in CustomPLayer)
```

Run a single test file:
```bash
npm test -- --testPathPattern="useSkipIntro"
```

## What this is

A WebOS (LG Smart TV) React app for **Filimo**, an Iranian streaming service. The app is RTL (Persian/Farsi UI). All API calls go to `https://www.filimo.com/api/fa/v1/` and include a `devicetype=react_tizen` query param (legacy naming from the original Tizen build). The `UserAgent` header `{ os: "WebOs", an: "Filimo", vn: "1.00" }` is attached to every request.

## Architecture

**Entry point:** `src/index.js` wraps the app in `AuthProvider → Redux Provider → HashRouter`. HashRouter is required for TV platforms.

**State management:** Redux Toolkit. Two slices in `src/features/`:
- `auth.js` — user object and `isAuthenticated`
- `currentGenreOrCategory.js` — active genre/category and search query

**API layer:** `src/services/TMDB.js` — RTK Query `createApi` pointed at the Filimo API. All hooks (`useGetMoviesQuery`, `useGetMovieQuery`, etc.) come from here. Despite the filename, this is not TMDB — it's the Filimo REST API.

**Auth:** `src/components/AuthProvider.jsx` manages a `jwt` state backed by `localStorage`. Components access it via `useAuth()`. The `App.jsx` polls the profile endpoint every 2 seconds while logged in to validate the session and detect kids-lock changes.

**Routing:** Defined in `App.jsx`. The Navbar/Sidebar is hidden on player, movie detail, search, and several other routes.

**TV remote / spatial navigation:** `@noriginmedia/norigin-spatial-navigation` is initialized at app start with `rtl: true`. Components use `useFocusable()` and `FocusContext`. The app also tracks a `mode` in localStorage (`KeyboardMode` vs `PointerMode`) by listening to `mousemove`/`wheel`/`keydown` events globally.

**localStorage keys used throughout the app:**
- `jwt` — auth token
- `mode` — `"KeyboardMode"` or `"PointerMode"`
- `kids-Lock` — boolean string
- `MenuData` — cached sidebar menu
- `lastdataloaded` / `lastdataloadedSeries` / `lastdataloadedMovies` — cached content rows for home pages
- Various `lastFocus*` keys — spatial nav focus restoration across page transitions
- `movie_cast_time`, `movie_uid` — player state passed between routes via localStorage

## Custom HLS Player (`src/components/CustomPLayer/`)

The main player is `HlsTvPlayer.jsx`. The older `src/components/Player/TvPlayer.jsx` still exists as a wrapper but delegates to `HlsTvPlayer`. See `CustomPLayer/PLAYER_FEATURES.md` for full feature documentation.

Player architecture — each concern is isolated in its own hook under `CustomPLayer/hooks/`:
- `useHls` — HLS.js lifecycle, quality levels, 3-tier error recovery
- `usePlaybackControls` — play/pause/seek/mute/speed/quality
- `useSubtitles` — VTT segment fetching, cue display, appearance settings
- `useSkipIntro` / `useNextEpisode` — intro skip and auto-advance logic
- `useUiTimer` — 5-second auto-hide with pause-while-open-modal logic
- `usePlayerKeyboard` — global keydown handler with 100 ms throttle

Shared state flows through `CustomPLayer/context/PlayerContext.js`.

All time values displayed to the user go through `utils/toFarsiDigits.js` to render Eastern Arabic numerals.

## Key patterns

- **Focus restoration:** When navigating back to a page, `lastFocus*` localStorage keys are read to restore the previously focused element via `setFocus()`.
- **Kids lock:** Checked on profile poll; stored in `localStorage("kids-Lock")` and in `App`'s `isKid` state, passed down via `OnlineStatusContext`.
- **Online status context:** `OnlineStatusContext` (exported from `App.jsx`) provides `{ isOnline, isKid, isSeasonChange, setIsSeasonChange }` to all route components.
- **Content rows:** `ContentRow.jsx`, `ContentCatRow.jsx`, `ContentMoreRow.jsx`, etc. are generic row renderers. `Movies.jsx` uses `PAGE_TYPE_CONFIG` to drive home/series/movie page variants from a single component.
