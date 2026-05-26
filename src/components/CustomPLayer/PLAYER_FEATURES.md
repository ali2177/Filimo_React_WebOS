# HlsTvPlayer — Feature Documentation

A fully custom HLS video player built for Tizen/WebOS TV apps using React, HLS.js, and norigin spatial-navigation.

---

## Playback

### HLS Adaptive Streaming
- Streams HLS (`.m3u8`) content via HLS.js.
- Supports adaptive bitrate (ABR) — quality adjusts automatically to network conditions.
- Manual quality override available through the Settings modal.
- **Error recovery (3-tier):**
  1. Network errors → retries up to 3 times via `hls.startLoad()`.
  2. Media decode errors → automatic recovery via `hls.recoverMediaError()`.
  3. Unrecoverable fatal errors → shows a Persian error overlay (`خطا در پخش ویدیو`) with a context-specific message (network vs. fatal).

### Resume from Last Watch Position

- When the player mounts, if `resumeFrom` prop is greater than 0, playback automatically starts from that second.
- The position comes from `watch_action.last_watch_position.last_second` in the movie API response, stored in `localStorage("movie_last_watch_time")` by `MovieInfo` when the user presses Play.
- Seek is applied on the first `canplay` event (or immediately if the video is already ready), so it works reliably regardless of network speed.
- When the user navigates to a new episode, `movie_last_watch_time` is reset to `0` so resume does not trigger for fresh episode loads.

### Play / Pause
- Toggle via the Play button in the control bar.
- When the player UI is hidden, pressing **Enter** on the remote toggles play/pause.
- State is driven by real video events (`play`/`pause`), not React state alone.

### Seek ±15 seconds
- Rewind 15 s and Forward 15 s buttons in the control bar.

### Restart
- Dedicated button that jumps to the beginning of the video (seeks to `00:00`).

### Mute / Unmute
- Mute toggle in the control bar.
- Muted state is driven by the video element's `volumechange` event — also catches the browser's autoplay muted fallback automatically.

### Playback Speed
- Available speeds: `0.25×`, `1.0×` (default), `1.25×`, `1.5×`, `2.0×`.
- Configurable via the Settings modal.

### Quality Selection
- **Auto** — HLS.js ABR selects the best level for the connection.
- **Manual** — any available rendition from the HLS manifest can be locked.
- The Settings button shows an HD / FHD / 2K badge reflecting the currently playing level.

---

## Seek Bar

### Interactive Scrubbing
- The seek bar is a separate focusable element below the control row.
- When focused, left/right arrow keys scrub in 15-second steps.
- Seeking is **real-time** — the main video position updates immediately on every arrow press; no Enter confirmation is needed.
- Pressing **Enter** or **Up** exits scrub mode.

### Seek Preview Thumbnails
- A hidden second HLS instance (lowest quality, `autoStartLoad: false`) loads independently of the main video.
- When the seek bar opens, this instance starts loading from the current position.
- As the user scrubs, frames are drawn to a `<canvas>` from the preview video — showing content the main video may not have buffered yet.
- A floating preview box above the thumb shows the frame and the target timecode in Farsi numerals.

### Time Display
- Current time and total duration shown next to the seek bar.
- All numbers are rendered in Eastern Arabic (Farsi) digits.

---

## Skip Intro

- Activated when the current playback time falls between `introStart` and `introEnd` (passed as props).
- **Two buttons appear simultaneously:**
  - A floating overlay button (`SkipIntroButton`) shown when the player UI is hidden.
  - An in-UI button (`SkipIntroUiButton`) inside the player controls when the UI is visible.
- Pressing either button seeks directly to `introEnd` using the `seeked` event pattern (avoids AbortError).
- When skip intro is active, remote focus is automatically directed to the skip button.

---

## Next Episode

- Activated when playback reaches `castData.start` (seconds before the end).
- A floating **"تماشای قسمت بعد"** (Watch Next Episode) button appears in the bottom-right corner.
- The button is hidden while the player UI is visible; it reappears when the UI hides.
- **Auto-play countdown:** if Auto-play Next is enabled, a CSS fill animation counts down 10 seconds, then navigates automatically.
- A dismiss (✕) button lets the user cancel the auto-advance.
- Navigation uses `onNextEpisode(uid)` — no page reload; the player remounts cleanly via `key={movieUid}`.
- Once dismissed, the button does not reappear for the current session.

---

## Subtitles

### Track Selection
- Available subtitle tracks are parsed from the HLS master playlist.
- Selecting a track lazy-loads VTT segments on demand, prefetching 2 segments ahead.
- Segment duration is read dynamically from the `#EXTINF` tags in the playlist (median value), so variable-length segments are handled correctly. Falls back to 10 s only if no `#EXTINF` data is found.
- "بدون زیرنویس" (No Subtitles) option always present.

### Appearance Customisation
- Accessible from the Subtitle modal → Settings layer:
  - **Text colour:** White, Yellow, Cyan, Red.
  - **Text size:** 80%, 100%, 120%, 150%.
  - **Background:** None, Black (75% opacity), White (60% opacity).
- A live subtitle preview is shown behind the modal while adjusting appearance settings.
- Reset to defaults option included.

---

## Multi-Audio

- Multiple audio tracks (from HLS) are detected automatically.
- The audio button appears in the control bar only when more than one track is available.
- Track names are resolved to Persian labels (فارسی, انگلیسی, عربی) by ISO 639 language code or track name.

---

## Series / Episodes

- Enabled when `isSeries` prop is true and `seriesData` is provided.
- **Episode Sheet** lists all episodes of the current season with a "در حال تماشا" (Now Playing) badge.
- **Season selector** sub-layer lets the user switch seasons.
- Selecting an episode navigates cleanly without page reload.
- Two additional buttons appear in the control bar: open episode list and skip to next episode.

---

## Buffering Indicator

- A centered CSS spinner appears whenever the video stalls (`waiting` event).
- Spinner disappears as soon as playback resumes (`playing`, `canplay`, `canplaythrough`, or `pause`).
- Spinner is suppressed when an HLS error overlay is already shown.

---

## Player UI Auto-hide

- The player UI (controls, seek bar, info row) fades in on any key press or mouse/touch activity.
- Auto-hides after **5 seconds** of inactivity while playing; stays visible while paused.
- Immediately hidden when the Next Episode button appears.
- Completely hidden while any modal (Subtitle, Episode, Audio, Settings) is open.

---

## Modals

Four slide-in sheet modals, each with spatial navigation boundaries:

| Modal | Opened by |
|---|---|
| Subtitle | Subtitle button (control bar) |
| Audio | Audio button (control bar) |
| Episodes | Episodes button (control bar) |
| Settings | Settings button (control bar) |

- The player UI hides while a modal is open.
- Each modal handles **Backspace** in capture phase to intercept before the global handler.
- Closing any modal restores the UI timer and sets spatial-nav focus back to the **Play** button.
- Multi-layer navigation (e.g. Settings → Quality sub-layer) supported with Back button and Backspace.

---

## TV Remote / Keyboard Handling

| Key | Behaviour |
|---|---|
| **Enter** | Play/Pause when UI hidden and no modal; handled by spatial nav otherwise |
| **Arrow keys** | Navigate focusable elements; scrub seek bar when active |
| **Backspace** | Hide UI and resume play (if UI visible) → Close modal (if open) → Navigate back |
| Any key | Resets the UI auto-hide timer |

- 100 ms throttle on keydown to avoid repeated rapid-fire events.
- Capture-phase Backspace in modals prevents the global handler from firing.

---

## Props Reference

```jsx
<HlsTvPlayer
  src="https://…/master.m3u8"   // HLS master playlist URL
  movieTitle="…"                 // Short title shown in info row
  movieFullTitle="…"             // Full title
  movieSubtitle="…"              // Subtitle/tagline
  isSeries={true}                // Enables series UI
  seriesData={[…]}               // Array of seasons with episodes
  introStart={60}                // Skip-intro window start (seconds)
  introEnd={180}                 // Skip-intro window end (seconds)
  castData={{ start, nextPartUid, … }} // Next-episode trigger data
  onNextEpisode={(uid) => {…}}   // Called when navigating to next episode
  autoPlay={true}                // Auto-start playback on mount
  resumeFrom={2675}              // Seek to this second on mount (0 = start from beginning)
/>
```

---

## Tests

72 tests across utils, hooks, and components. Run with `npm test`.

| File | Tests |
|---|---|
| `utils/__tests__/formatTime.test.js` | 9 |
| `utils/__tests__/toFarsiDigits.test.js` | 6 |
| `hooks/__tests__/useSkipIntro.test.js` | 7 |
| `hooks/__tests__/useNextEpisode.test.js` | 8 |
| `hooks/__tests__/useModal.test.js` | 8 |
| `hooks/__tests__/usePlaybackControls.test.js` | 22 |
| `components/NextEpisodeButton/__tests__/NextEpisodeButton.test.jsx` | 8 |
| `components/SkipIntroButton/__tests__/SkipIntroButton.test.jsx` | 4 |

---

## Architecture

```
HlsTvPlayer.jsx          — root; assembles hooks, context, and layout
├── hooks/
│   ├── useHls           — HLS lifecycle, levels, quality switching, error recovery
│   ├── useBuffering     — isBuffering state via video waiting/playing events
│   ├── useVideoTime     — currentTime, duration, bufferedPercent
│   ├── usePlaybackControls — play/pause/mute/seek/speed/quality/autoplay
│   ├── useSubtitles     — track list, VTT segment loading (dynamic duration), cue display
│   ├── useAudioTracks   — multi-audio detection and switching
│   ├── useModal         — modal open/close, pause-on-open
│   ├── useUiTimer       — visibility state, 5 s auto-hide timer
│   ├── usePlayerKeyboard — global keydown handler
│   ├── useSkipIntro     — intro range detection, skip action
│   └── useNextEpisode   — cast trigger, dismiss state
├── context/PlayerContext — shared state for all sub-components
├── components/
│   ├── PlayerUi/
│   │   ├── InfoRow/         — title and metadata row
│   │   ├── ControlRow/
│   │   │   ├── ControlRow.jsx  — play/seek/modal buttons (uses icon components)
│   │   │   ├── components/PlayerButton.jsx
│   │   │   └── icons/       — PlayIcon, PauseIcon, RewindIcon, ForwardIcon,
│   │   │                       RestartIcon, EpisodesIcon, NextEpisodeIcon,
│   │   │                       AudioIcon, SubtitleIcon, SettingsIcon
│   │   ├── SeekBar/         — scrubbing, thumbnail preview, Farsi time display
│   │   └── SkipIntroUiButton/ — in-UI skip intro button
│   ├── PlayerSheet/     — slide-in modal wrapper
│   ├── SubtitleSheet/   — subtitle + appearance settings (SheetRow)
│   ├── EpisodeSheet/    — season/episode selector (EpisodeRow, SeasonRow, NavRow)
│   ├── AudioSheet/      — audio track selector (AudioRow)
│   ├── SettingsSheet/   — quality, speed, auto-play toggle (SelectRow, NavRow, ToggleRow)
│   ├── SkipIntroButton/ — floating overlay skip button
│   └── NextEpisodeButton/ — floating next episode button with countdown
└── utils/
    ├── formatTime.js    — seconds → MM:SS / HH:MM:SS
    ├── toFarsiDigits.js — converts ASCII digits to Eastern Arabic
    └── utils.js         — HLS playlist parsing, VTT fetch/parse, EXTINF duration extraction
```
