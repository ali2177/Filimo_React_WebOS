# Player — Buffer-Stall Freeze & Stuck-After-Seek Fixes (port to Tizen)

## Background

QA on the WebOS TV build hit two playback bugs. Both are **pre-existing** (they
predate the "don't pause the video when a player menu opens" change — that
change only made the first one surface more often by removing an accidental
relief valve). They must be ported to the Tizen player too.

An on-screen `VIDEO STATE LOG` overlay was used to diagnose them (TVs have no
terminal). The log showed:

1. **Buffer death-spiral / sudden pausing** — `bufferFullError`,
   `bufferAppendError (FATAL)`, `bufferStalledError`, repeated `BUFFER_FLUSH`,
   and constant `LEVEL_SWITCHING` (360p↔480p↔720p↔1080p). The video froze at
   one position for ~20-30s while HLS thrashed.
2. **Black screen stuck after seeking forward** — seeking into an unbuffered
   region emitted `pause(evt) while seeking` and then **nothing** — no `seeked`,
   no `playing`. Playback never resumed.

> **Follow-up (2026-07) — supersedes parts of the fixes below.** QA still hit
> the black-screen-after-seek after the `1c1a454` port. Root cause: the very
> aggressive buffer config here (`backBufferLength: 0`) flushed all played video
> every segment, so **backward seeks landed in an empty buffer and stalled**, and
> two of three seek paths (keyboard scrub, ±15s buttons) had no resume watchdog.
> The current WebOS values / structure are:
>
> - `useHls.js` buffer config is now `maxBufferLength: 30`, `backBufferLength: 30`,
>   `maxBufferSize: 20MB` (the size cap is the memory backstop that makes the
>   larger back buffer safe), plus `capLevelToPlayerSize: true` to cut ABR churn.
>   The non-fatal stall nudge is guarded with `!v.seeking` so it can't fight the
>   seek watchdog.
> - `resumeAfterSeek` was extracted to `src/components/CustomPLayer/utils/resumeAfterSeek.js`
>   and is now used by **every** seek path: seekbar click, keyboard-scrub commit,
>   and the ±15s buttons in `usePlaybackControls.js`.
> - `useBuffering.js` now shows the spinner on `seeking`/`waiting` and does **not**
>   hide it on a `pause` fired while `video.seeking` — so a stalled seek shows a
>   spinner instead of a silent black screen.
> - The **thumbnail-preview feature was removed entirely** (it ran a second
>   `new Hls()` + hidden `<video>`, doubling MSE/decoder pressure on the TV).
>   `SeekBar.jsx` is now a plain seek bar (progress + scrub marker + time label),
>   and keyboard arrows move the marker while **OK commits** the seek.
>
> When porting to Tizen, prefer these values/structure over the original diffs
> below. The section-3 seekbar diff below is historical — mirror the current
> `SeekBar.jsx` instead.

## Root causes

| Bug | Root cause |
|-----|-----------|
| Death-spiral | HLS buffer config too large for a TV's small MSE memory quota (`maxBufferLength: 20` **and** `backBufferLength: 20` ≈ 40s resident video), plus ABR thrash from a manual quality pick using `loadLevel` (which does **not** disable ABR). |
| Stuck-after-seek | Seekbar resume depended **solely** on the `seeked` event. When a seek stalls in an unbuffered region, `seeked` never fires, so `video.play()` is never called → permanent black screen. |

## The fixes

Three files. Match by component/hook name if Tizen paths differ (the WebOS
player lives under `src/components/CustomPLayer/`).

---

### 1. `hooks/useHls.js` — shrink the buffer + recover non-fatal stalls

**a) Buffer config** — the single biggest win. `backBufferLength: 0` is the key
line: TVs must not retain already-played video.

```diff
     const hls = new Hls({
       renderTextTracksNatively: false,
       enableWorker: true,
-      maxBufferLength: 20,
-      backBufferLength: 20,
+      maxBufferLength: 10,             // keep ~10s ahead (was 20)
+      backBufferLength: 0,             // don't retain played video — TVs have tiny MSE memory (was 20)
+      maxBufferSize: 20 * 1000 * 1000, // hard ~20MB cap so HLS evicts by size before hitting the platform quota
     });
```

**b) Non-fatal stall recovery** — nudge the playhead on a buffer stall instead
of letting it escalate to a fatal media recover (the long freeze). This goes at
the **top of the existing `Hls.Events.ERROR` handler**, replacing the
`if (!data.fatal) return;` early-return:

```diff
     hls.on(Hls.Events.ERROR, (_, data) => {
-      if (!data.fatal) return;
+      // Non-fatal buffer hiccups: nudge the playhead / let HLS evict & resume
+      // instead of letting them spiral into a fatal recover (the long freeze).
+      if (!data.fatal) {
+        if (
+          data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR ||
+          data.details === Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL
+        ) {
+          const v = videoRef.current;
+          if (v && !v.paused) v.currentTime += 0.1; // skip the stalled hole
+        }
+        return;
+      }

       if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRetries < 3) {
```

> Keep the rest of the fatal branch (NETWORK_ERROR retry → `startLoad`,
> MEDIA_ERROR → `recoverMediaError`, else → destroy) exactly as-is.

---

### 2. `hooks/usePlaybackControls.js` — lock the level on manual quality pick

Use `currentLevel` (which disables ABR) instead of `loadLevel` (which does not),
so ABR stops fighting the user's choice and thrashing levels.

```diff
   const changeQuality = useCallback((index) => {
     if (!hlsRef.current) return;
-    if (index === -1) hlsRef.current.currentLevel = -1;
-    else hlsRef.current.loadLevel = index;
+    // currentLevel (not loadLevel): -1 re-enables ABR, otherwise lock the level
+    // so ABR can't keep fighting the manual pick and thrash level switches.
+    hlsRef.current.currentLevel = index;
     setSelectedLevelIndex(index);
   }, [hlsRef]);
```

> If the Tizen build has a `changeQuality` unit test, update its assertion from
> `hlsRef.current.loadLevel` to `hlsRef.current.currentLevel`.

---

### 3. `components/PlayerUi/SeekBar/SeekBar.jsx` — robust resume after seek

Add a `resumeAfterSeek` helper that resumes on **any** of `seeked` / `canplay` /
`playing`, plus a 1.5s watchdog that force-plays (and nudges to re-trigger HLS
fragment loading) if the seek stalled. Then call it from the seekbar click
handler instead of the lone `seeked` listener.

**Add the helper** (near the other `useCallback`s, e.g. after `handleMouseLeave`):

```js
// Resume playback after a seek WITHOUT depending solely on the `seeked` event.
// Seeking into an unbuffered region can stall so that `seeked` never fires,
// which left the player stuck on a black screen. Resume on any of the
// recovery events, and keep a watchdog that force-plays (and nudges to
// re-trigger HLS fragment loading) if nothing has happened in time.
const resumeAfterSeek = useCallback((v, target) => {
  let done = false;
  const events = ["seeked", "canplay", "playing"];
  const cleanup = () => {
    events.forEach((e) => v.removeEventListener(e, resume));
    clearTimeout(watchdog);
  };
  const resume = () => {
    if (done) return;
    done = true;
    cleanup();
    v.play().catch(() => {});
  };
  events.forEach((e) => v.addEventListener(e, resume, { once: true }));

  // Watchdog: if still stalled at the seek target after 1.5s, kick it.
  const watchdog = setTimeout(() => {
    if (done) return;
    if (v.readyState < 3 && Math.abs(v.currentTime - target) < 0.5) {
      // nudge by a frame to force HLS to (re)load the segment at this position
      v.currentTime = target + 0.05;
    }
    v.play().catch(() => {});
  }, 1500);
}, []);
```

**Wire it into the seekbar click handler:**

```diff
               const v     = videoRef.current;
               if (v && duration) {
                 const wasPlaying = !v.paused;
-                v.currentTime = ratio * duration;
+                const target = ratio * duration;
+                v.currentTime = target;
                 setSeekPending(ratio * 100);
                 resetUiTimer();
-                if (wasPlaying) {
-                  v.addEventListener("seeked", () => v.play().catch(() => {}), { once: true });
-                }
+                if (wasPlaying) resumeAfterSeek(v, target);
               }
```

> Make sure `useCallback` is imported. If the Tizen seekbar resumes playback the
> same lone-`seeked` way anywhere else (e.g. keyboard/remote seek, or the
> ±15s buttons), apply the same `resumeAfterSeek` there too.

---

## Notes for the Tizen port

- The `Hls` config options (`maxBufferLength`, `backBufferLength`, `maxBufferSize`)
  and error details (`Hls.ErrorDetails.BUFFER_STALLED_ERROR`,
  `BUFFER_NUDGE_ON_STALL`) are standard hls.js — same API on Tizen.
- `backBufferLength: 0` is the most important single change; without it the
  bufferFull/append errors keep happening on memory-constrained TVs.
- After porting, verify on-device: (1) open a menu / change quality → no
  `bufferStalledError` / level thrash / freeze; (2) seek far forward → resumes
  within ~1.5s, never a permanent black screen.

## Reference commit (WebOS)

`1c1a454` — "player: fix buffer-stall freezing and stuck-after-seek".
The temporary on-screen diagnostic overlay lives in
`src/components/CustomPLayer/components/PlayerDebugOverlay/` and can be ported
too if you want the same `VIDEO STATE LOG` while testing on a Tizen device.

---

# Control-Button Tooltip Labels (port to Tizen)

## What

A text label (tooltip) now appears **above** a control-row button whenever that
button is active — either focused via the TV remote / spatial navigation or
hovered with the mouse. Because the button already calls `setFocus` on
`onMouseEnter`, a single `focused`-driven render covers both cases; no separate
hover handler is needed.

Two files under `src/components/CustomPLayer/components/PlayerUi/ControlRow/`.

---

### 1. `components/PlayerButton.jsx` — accept a `label` prop and render it

Add a `label` prop and render it as a `<span>` only when the button is
`focused`.

```diff
 const PLayerButton = ({
   onFocus,
   onEnterPress,
   focuskey,
   handleAction,
+  label,
   children,
 }) => {
```

```diff
         onClick={handleAction}
       >
+        {label && focused && (
+          <span className="player-btn-label">{label}</span>
+        )}
         {children}
       </div>
```

---

### 2. `components/PlayerButton.css` — position + style the tooltip

`.Player-button` must be `position: relative` so the absolutely-positioned label
anchors to it.

```diff
 .Player-button {
+  position: relative;
   display: flex;
   padding: 1.2rem;
   justify-content: center;
   align-items: center;
   border-radius: 50rem;
   background: rgba(4, 4, 4, 0.5);
 }
+
+.player-btn-label {
+  position: absolute;
+  bottom: calc(100% + 0.8rem);          /* sit above the button */
+  left: 50%;
+  transform: translateX(-50%);          /* center over the button */
+  padding: 0.3rem 0.9rem;
+  border-radius: 1.2rem;
+  background: var(--Dark-Mode-Background-Colors-Background-03, #282828);
+  color: #fff;
+  font-size: 0.9rem;
+  font-weight: 500;
+  line-height: 1.4;
+  white-space: nowrap;
+  pointer-events: none;
+  backdrop-filter: blur(20px);
+  z-index: 5;
+}
```

---

### 3. `ControlRow.jsx` — pass a label per button

Each `<PLayerButton>` takes a `label`. These are sample strings — edit the
wording per button:

```diff
-          <PLayerButton handleAction={togglePlay} focuskey="Play">
+          <PLayerButton handleAction={togglePlay} focuskey="Play" label={playing ? "توقف" : "پخش"}>
             {playing ? <PauseIcon /> : <PlayIcon />}
           </PLayerButton>
```

| Button (`focuskey`) | Sample label |
|---------------------|--------------|
| `Play`              | `پخش` / `توقف` (play/pause) |
| `Forward` (−15s)    | `۱۵ ثانیه عقب` |
| `Backward` (+15s)   | `۱۵ ثانیه جلو` |
| `Replay`            | `از ابتدا` |
| `SeriesEpisodes`    | `قسمت‌ها` |
| `NextEpisode`       | `قسمت بعدی` |
| `VoiceOpen`         | `صدا` |
| `SubtitleOpen`      | `زیرنویس` |
| `SettingOpen`       | `تنظیمات` |

## Notes for the Tizen port

- The label is center-anchored, so a long string on the leftmost/rightmost
  button can clip at the screen edge. Add edge-aware alignment if that shows up.
- Visibility is driven by `focused` (not CSS `:hover`) so it behaves the same on
  remote and mouse. Switch to `:hover` only if you want the label without focus.
- `backdrop-filter: blur(20px)` — verify it's supported/performant on the target
  Tizen webview; drop it if it causes jank.
