# Filimo — React WebOS / Tizen Smart TV App

A React-based Smart TV application for **Filimo**, an Iranian video streaming service. Built for LG WebOS and Samsung Tizen platforms with a fully RTL (Persian/Farsi) interface.

## Features

- Browse movies, series, and categories with a TV-optimized UI
- Full HLS video playback with quality selection, subtitles, and speed control
- Skip intro and auto-next-episode support
- TV remote spatial navigation (RTL-aware)
- Kids lock mode
- User authentication with JWT (stored in localStorage)
- Persian (Eastern Arabic) digit rendering throughout the UI
- Offline/online status detection

## Tech Stack

- **React 18** + Redux Toolkit (RTK Query for API calls)
- **HLS.js** for adaptive video streaming
- **@noriginmedia/norigin-spatial-navigation** for TV remote navigation
- **React Router v6** with HashRouter (required for TV platforms)
- **Create React App** build toolchain

## Getting Started

```bash
npm install
npm start       # Start dev server at http://localhost:3000
npm run build   # Production build
npm test        # Run test suite
```

## API

All requests go to `https://www.filimo.com/api/fa/v1/` with:
- Query param: `devicetype=react_tizen`
- UserAgent headers: `{ os: "WebOs", an: "Filimo", vn: "1.00" }`

## Project Structure

```
src/
├── components/
│   ├── CustomPLayer/       # HLS player — hooks, context, UI
│   ├── App.jsx             # Root component + routing
│   └── ...                 # Page and UI components
├── features/
│   ├── auth.js             # Redux auth slice
│   └── currentGenreOrCategory.js
├── services/
│   └── TMDB.js             # RTK Query API definition (Filimo REST API)
└── index.js                # Entry point: AuthProvider → Redux → HashRouter
```

## Player Architecture

The custom HLS player (`CustomPLayer/HlsTvPlayer.jsx`) isolates each concern into its own hook:

| Hook | Responsibility |
|---|---|
| `useHls` | HLS.js lifecycle, quality levels, error recovery |
| `usePlaybackControls` | Play/pause/seek/mute/speed/quality |
| `useSubtitles` | VTT cue fetching and display |
| `useSkipIntro` | Intro detection and skip button |
| `useNextEpisode` | Auto-advance to next episode |
| `useUiTimer` | 5-second UI auto-hide |
| `usePlayerKeyboard` | Global keydown handler (100ms throttle) |

## Navigation

Spatial navigation is initialized with `rtl: true`. Input mode (`KeyboardMode` / `PointerMode`) is tracked in localStorage and switched automatically on `keydown` / `mousemove` events. Focus is restored on page transitions via `lastFocus*` localStorage keys.

## License

Private — Filimo / Telika. All rights reserved.
