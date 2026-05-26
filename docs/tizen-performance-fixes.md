# Samsung Tizen — Player Performance Fixes

These fixes address observable lag and stuttering on Tizen devices during video playback, seeking, and UI interactions. The root cause is cumulative: multiple patterns that work on WebOS's faster hardware all fire together on Tizen's tighter CPU/GPU budget. Apply these in order of priority.

---

## Fix 1 (CRITICAL) — Throttle `timeupdate` to once per second

**File:** `src/components/CustomPLayer/hooks/useVideoTime.js` lines 13–24

**Problem:** `setCurrentTime()` is called on every `timeupdate` event, which fires approximately 4 times per second. Each call propagates through `PlayerContext` and triggers a re-render of all 10 subscribing components simultaneously (SeekBar, ControlRow, InfoRow, PlayerUI, 4 modal sheets, SkipIntroButton, PlayerButton). On Tizen, this render stack fires every 250ms and is the single largest performance drain.

**Fix:** Only update React state when the integer second changes. Store the actual `currentTime` value in a ref for the seek bar to read directly from the video element:

```js
const lastSecRef = useRef(-1);

const updateTime = () => {
  const sec = Math.floor(video.currentTime);
  if (sec !== lastSecRef.current) {
    lastSecRef.current = sec;
    setCurrentTime(video.currentTime);
  }
};
video.addEventListener("timeupdate", updateTime);
```

Also debounce `setBufferedPercent` to fire at most every 500ms:

```js
let bufferTimeout = null;
const updateBuffered = () => {
  clearTimeout(bufferTimeout);
  bufferTimeout = setTimeout(() => {
    if (!video.duration || !video.buffered.length) return;
    const end = video.buffered.end(video.buffered.length - 1);
    setBufferedPercent((end / video.duration) * 100);
  }, 500);
};
```

---

## Fix 2 (CRITICAL) — Skip `setSubtitleText` when text has not changed

**File:** `src/components/CustomPLayer/hooks/useSubtitles.js` lines 99–103

**Problem:** `setSubtitleText()` is called on every `timeupdate` event even when the same subtitle line is still on screen. This causes a React state update and subtitle overlay re-render up to 4 times per second for no visual change.

**Fix:** Track the last displayed text in a ref and skip the state update when the text is unchanged:

```js
const lastSubtitleTextRef = useRef("");

// Inside updateSubtitle:
const newText = activeCue ? activeCue.text : "";
if (newText !== lastSubtitleTextRef.current) {
  lastSubtitleTextRef.current = newText;
  setSubtitleText(newText);
}
```

---

## Fix 3 (CRITICAL) — Move subtitle segment prefetching out of `timeupdate`

**File:** `src/components/CustomPLayer/hooks/useSubtitles.js` lines 75–96

**Problem:** Inside the `timeupdate` handler, up to 3 VTT segments are fetched concurrently using `fetch()`. These async network calls fire inside a fast event loop (4×/sec), causing CPU spikes on Tizen whenever the player advances to a new segment. `setSubtitleCache` is also called inside the fetch loop, causing multiple state batches per second.

**Fix:** Move the prefetch logic into a separate `useEffect` that only runs when `segmentIndex` changes — not on every tick:

```js
// Prefetch effect — runs only when segment position advances
useEffect(() => {
  if (!segments.length) return;
  const prefetch = async () => {
    for (let i = segmentIndex; i <= segmentIndex + 2; i++) {
      if (segments[i] && !loadedSegments.has(segments[i])) {
        const segCues = await fetchVttSegments(segments[i]);
        setSubtitleCache((prev) => ({ ...prev, [segments[i]]: segCues }));
      }
    }
  };
  prefetch();
}, [segmentIndex]); // fires only when the player crosses a segment boundary
```

The `timeupdate` handler then only does the lightweight cue lookup (see Fix 2).

---

## Fix 4 (HIGH) — Disable preview HLS instance on Tizen

**File:** `src/components/CustomPLayer/components/PlayerUi/SeekBar/SeekBar.jsx` lines 67–92

**Problem:** A second `Hls` instance is created inside the SeekBar to show seek thumbnails. On Tizen this means two HLS manifests parsed, two decoders active, and double memory pressure. Tizen TVs have tighter memory limits than WebOS and this instance competes directly with the main player.

**Fix:** Detect Tizen at runtime and skip the preview HLS setup entirely:

```js
const isTizen =
  typeof tizen !== "undefined" ||
  navigator.userAgent.toLowerCase().includes("tizen");

useEffect(() => {
  if (isTizen) return; // skip on Tizen — no seek thumbnails
  const video = previewVideoRef.current;
  if (!video || !src) return;
  const hls = new Hls({ startLevel: 0, autoStartLoad: false, maxBufferLength: 8 });
  hls.loadSource(src);
  hls.attachMedia(video);
  previewHlsRef.current = hls;
  // ... rest of setup
}, [src, isTizen]);
```

The seek bar still works normally — users just won't see thumbnail previews while scrubbing on Tizen.

---

## Fix 5 (HIGH) — Throttle seek-preview canvas draw to 6 fps

**File:** `src/components/CustomPLayer/components/PlayerUi/SeekBar/SeekBar.jsx` lines 170–177

**Problem:** `handleMouseMove` calls `seekAndPreview()` → `drawImage()` (a synchronous canvas operation) on every pointer movement. On Tizen this can reach 30–60 calls per second during scrubbing, blocking the main thread each time.

**Fix:** Throttle the handler to at most 6 fps (~160ms interval):

```js
const lastPreviewDrawRef = useRef(0);

const handleMouseMove = useCallback((e) => {
  const now = Date.now();
  if (now - lastPreviewDrawRef.current < 160) return; // ~6fps cap
  lastPreviewDrawRef.current = now;

  const rect = e.currentTarget.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const t = ratio * (durationRef.current || 0);
  previewTimeRef.current = t;
  setPreviewTime(t);
  seekAndPreview(t);
}, [seekAndPreview]);
```

---

## Fix 6 (HIGH) — Fix missing `useMemo` dependencies in `playerContextValue`

**File:** `src/components/CustomPLayer/HlsTvPlayer.jsx` lines 174–180

**Problem:** The `playerContextValue` useMemo dependency array is missing values that are used inside it (`subtitleText`, `showSubtitlePreview`, `resetUiTimer`). This causes the context object to sometimes be recreated unexpectedly, forcing all 10 consuming components to re-render at once with no actual value change.

**Fix:** Add all referenced values to the dependency array. Enable the ESLint `react-hooks/exhaustive-deps` rule to prevent this class of bug in future.

---

## Fix 7 (MEDIUM) — Replace progress bar `width` transition with `scaleX`

**File:** `src/components/CustomPLayer/components/PlayerUi/SeekBar/SeekBar.css` lines 87–89
**File:** `src/components/CustomPLayer/components/PlayerUi/SeekBar/SeekBar.jsx`

**Problem:** `.progress-played` uses `transition: width 0.1s linear`. Every `timeupdate` event triggers a CSS width change which causes a full layout recalculation. This fires every ~250ms during playback, creating steady layout pressure on Tizen's compositor.

**Fix (CSS):**

```css
.progress-played {
  width: 100%;           /* always full width */
  transform-origin: left center;
  transition: transform 0.1s linear; /* GPU only, no layout recalc */
}
```

**Fix (JSX):**

```jsx
<div
  className="progress-played"
  style={{ transform: `scaleX(${playedPercent / 100})` }}
/>
```

`transform: scaleX()` is GPU-composited — it never touches layout.

---

## Fix 8 (MEDIUM) — Memoize the subtitle overlay inline style object

**File:** `src/components/CustomPLayer/HlsTvPlayer.jsx` lines 196–209

**Problem:** The subtitle `<div>` creates a new style object on every render, causing React to see it as always changed. With `timeupdate` firing frequently, this object is recreated and reconciled multiple times per second.

**Fix:**

```jsx
const subtitleInlineStyle = useMemo(() => ({
  color: subtitleStyle.color,
  fontSize: `${subtitleStyle.size * 24}px`,
  backgroundColor: subtitleStyle.background,
  padding: subtitleStyle.background !== "transparent" ? "2px 10px" : undefined,
  borderRadius: subtitleStyle.background !== "transparent" ? "4px" : undefined,
}), [subtitleStyle]);
```

---

## Fix 9 (MEDIUM) — Fix `useUiTimer` modal-open guard

**File:** `src/components/CustomPLayer/hooks/useUiTimer.js` lines 43–50

**Problem:** `isModalOpen` is in the event listener `useEffect` dependency array. Every time a modal opens or closes, three event listeners (`mousemove`, `mousedown`, `touchstart`) are removed and re-added. On Tizen, listener registration/de-registration is more expensive.

**Fix:** Move the guard inside `resetUiTimer` via a ref so the event listener effect never needs to re-run:

```js
const isModalOpenRef = useRef(isModalOpen);
useEffect(() => { isModalOpenRef.current = isModalOpen; }, [isModalOpen]);

const resetUiTimer = useCallback(() => {
  if (isModalOpenRef.current) return;
  // ... timer logic
}, []);

useEffect(() => {
  const container = videoRef.current?.parentElement;
  if (!container) return;
  const events = ["mousemove", "mousedown", "touchstart"];
  events.forEach((e) => container.addEventListener(e, resetUiTimer));
  resetUiTimer();
  return () => events.forEach((e) => container.removeEventListener(e, resetUiTimer));
}, [videoRef, resetUiTimer]); // isModalOpen removed
```

---

## Fix 10 (MEDIUM) — Replace next-episode CSS fill animation

**File:** `src/components/CustomPLayer/components/NextEpisodeButton/NextEpisodeButton.css` lines 86–112

**Problem:** A 10-second `scaleX` CSS keyframe animation (`next-episode-fill-anim`) runs while the video is playing. On Tizen, CSS animations share GPU with video decoding. Having an animated overlay on top of a playing video competes for compositor resources.

**Fix:** Remove the CSS animation and drive the fill with a `setInterval` that updates an inline `width` (or `scaleX`) value once per second:

```jsx
const [fillPercent, setFillPercent] = useState(0);

useEffect(() => {
  if (!autoPlayNext) { setFillPercent(0); return; }
  setFillPercent(0);
  const interval = setInterval(() => {
    setFillPercent((p) => {
      if (p >= 100) { clearInterval(interval); return 100; }
      return p + 10; // 10% per second over 10 seconds
    });
  }, 1000);
  return () => clearInterval(interval);
}, [autoPlayNext]);
```

```jsx
<div
  className="next-episode-fill"
  style={{ transform: `scaleX(${fillPercent / 100})` }}
/>
```

Remove the `@keyframes next-episode-fill-anim` and `animation:` property from the CSS entirely.

---

## Platform detection reference

Use this snippet anywhere you need to conditionally apply Tizen-specific behavior:

```js
const isTizen =
  typeof tizen !== "undefined" ||
  navigator.userAgent.toLowerCase().includes("tizen");
```

---

## Testing

After applying all fixes, run the test suite:

```bash
npm test
```

All 72 tests in `CustomPLayer` should pass. On a physical Tizen device, verify:
- Video playback is smooth with no UI lag
- Seeking works without thumbnail previews (by design)
- Subtitles display correctly with no flicker
- Next-episode countdown fills correctly over 10 seconds
- Modal open/close does not cause any stuttering
