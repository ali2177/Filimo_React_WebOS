# Filimo WebOS

A React-based smart TV app for [Filimo](https://www.filimo.com), an Iranian streaming service. Built for **LG WebOS** TVs with full RTL (Persian/Farsi) UI and TV remote spatial navigation.

## Features

- Browse movies, series, and categories in a TV-optimized RTL layout
- Custom HLS video player with quality selection, subtitles, intro skip, and auto next-episode
- Kids lock mode with profile-based session validation
- Offline/network error handling
- Search with Persian keyboard input
- Full TV remote navigation (D-pad, back, play/pause, etc.)

## Tech Stack

| Concern | Library |
|---|---|
| UI framework | React 18 + Create React App |
| State management | Redux Toolkit |
| API layer | RTK Query (`src/services/TMDB.js`) |
| Routing | React Router v6 (HashRouter for TV) |
| Spatial navigation | `@noriginmedia/norigin-spatial-navigation` (RTL mode) |
| HLS playback | `hls.js` |
| Styling | CSS Modules + JSS RTL |

## Getting Started

### Requirements

- Node.js 16+
- npm

### Install & run

```bash
npm install
npm start        # dev server at http://localhost:3000
```

### Build for production

```bash
npm run build    # output in /build
```

### Tests

```bash
npm test                                               # run all 72 tests
npm test -- --testPathPattern="useSkipIntro"           # run a single test file
```

Tests are located in `src/components/CustomPLayer/` and cover player hook logic.

## Project Structure

```
src/
├── components/
│   ├── CustomPLayer/          # Main HLS player and all player hooks
│   │   ├── HlsTvPlayer.jsx
│   │   ├── hooks/             # useHls, usePlaybackControls, useSubtitles, …
│   │   ├── context/           # PlayerContext
│   │   └── PLAYER_FEATURES.md
│   ├── Movies/                # Home / series / movie list pages
│   ├── Movie/                 # Movie detail page
│   ├── Player/                # Legacy player wrapper (delegates to CustomPLayer)
│   ├── Sidebar/ Navbar/       # Navigation chrome
│   ├── Login/                 # Auth screens
│   └── …                      # Other UI components
├── features/
│   ├── auth.js                # Redux slice — user + isAuthenticated
│   └── currentGenreOrCategory.js
├── services/
│   └── TMDB.js                # RTK Query API (Filimo REST, not TMDB)
└── utils/
    └── toFarsiDigits.js       # Converts numbers to Eastern Arabic numerals
```

## API

All requests go to `https://www.filimo.com/api/fa/v1/` with:
- Query param: `devicetype=react_tizen`
- User-Agent headers: `{ os: "WebOs", an: "Filimo", vn: "1.00" }`

Authentication uses a JWT stored in `localStorage("jwt")`. `AuthProvider.jsx` manages token lifecycle; `App.jsx` polls the profile endpoint every 2 seconds to validate the session and detect kids-lock changes.

## TV Remote Navigation

Spatial navigation is initialized globally with `rtl: true`. Components use `useFocusable()` and `FocusContext`. Focus positions are saved in `localStorage` (`lastFocus*` keys) and restored on back-navigation via `setFocus()`.

Input mode (`KeyboardMode` / `PointerMode`) is tracked in `localStorage("mode")` by listening to `mousemove`, `wheel`, and `keydown` events.
