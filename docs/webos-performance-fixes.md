# LG WebOS — Player Performance Fixes

WebOS is currently performing well. The fixes in this document are **code-quality and correctness improvements** — not urgent, but recommended to prevent technical debt and keep the codebase consistent with the Tizen build.

---

## Fix 1 — Correct missing `useMemo` dependencies in `playerContextValue`

**File:** `src/components/CustomPLayer/HlsTvPlayer.jsx` lines 174–180

**Problem:** The `playerContextValue` useMemo dependency array is missing `subtitleText`, `showSubtitlePreview`, and `resetUiTimer`. This can cause stale context reads, meaning some components may render with outdated values.

**Fix:** Audit the dependency array and add all values that are referenced inside the memo. Use the ESLint rule `react-hooks/exhaustive-deps` to catch this automatically.

```jsx
const playerContextValue = useMemo(() => ({
  // ... all values
}), [
  // make sure subtitleText, showSubtitlePreview, resetUiTimer are listed here
]);
```

---

## Fix 2 — Memoize the subtitle overlay inline style object

**File:** `src/components/CustomPLayer/HlsTvPlayer.jsx` lines 196–209

**Problem:** The subtitle `<div>` has an inline style object created fresh on every render. Even when `subtitleStyle` has not changed, a new object reference is created and React sees it as a change.

**Fix:** Wrap in `useMemo` so the style object is only recreated when `subtitleStyle` actually changes:

```jsx
const subtitleInlineStyle = useMemo(() => ({
  color: subtitleStyle.color,
  fontSize: `${subtitleStyle.size * 24}px`,
  backgroundColor: subtitleStyle.background,
  padding: subtitleStyle.background !== "transparent" ? "2px 10px" : undefined,
  borderRadius: subtitleStyle.background !== "transparent" ? "4px" : undefined,
}), [subtitleStyle]);

// Then in JSX:
<div className="subtitle-overlay" style={subtitleInlineStyle}>
```

---

## Fix 3 — Replace progress bar `width` transition with `scaleX`

**File:** `src/components/CustomPLayer/components/PlayerUi/SeekBar/SeekBar.css` lines 87–89
**File:** `src/components/CustomPLayer/components/PlayerUi/SeekBar/SeekBar.jsx`

**Problem:** The `.progress-played` bar uses a CSS `width` transition. Width changes trigger a full layout recalculation in the browser. On WebOS this is unnoticeable, but it is not best practice for a TV platform where layout reflows are expensive.

**Fix (CSS):** Switch to `transform: scaleX()` which is GPU-composited and does not cause layout recalculation:

```css
.progress-played {
  transform-origin: left center;
  width: 100%; /* full width, always */
  transition: transform 0.1s linear;
}
```

**Fix (JSX):** Drive it with inline transform instead of width:

```jsx
<div
  className="progress-played"
  style={{ transform: `scaleX(${playedPercent / 100})` }}
/>
```

---

## Fix 4 — Guard `useUiTimer` modal-open check inside the callback

**File:** `src/components/CustomPLayer/hooks/useUiTimer.js` lines 43–50

**Problem:** `isModalOpen` is listed as a dependency of the event listener `useEffect`, so every time a modal opens or closes, all `mousemove` / `mousedown` / `touchstart` listeners are removed and re-added. This is unnecessary churn.

**Fix:** Move the guard inside `resetUiTimer` using a ref, so the event listener effect never needs to re-run:

```js
const isModalOpenRef = useRef(isModalOpen);
useEffect(() => { isModalOpenRef.current = isModalOpen; }, [isModalOpen]);

const resetUiTimer = useCallback(() => {
  if (isModalOpenRef.current) return; // guard here instead of in effect deps
  // ... timer reset logic
}, []); // stable reference, no re-registration needed

useEffect(() => {
  const container = videoRef.current?.parentElement;
  if (!container) return;
  const events = ["mousemove", "mousedown", "touchstart"];
  events.forEach((e) => container.addEventListener(e, resetUiTimer));
  resetUiTimer();
  return () => events.forEach((e) => container.removeEventListener(e, resetUiTimer));
}, [videoRef, resetUiTimer]); // isModalOpen removed from deps
```

---

## Fix 5 — Skip `setSubtitleText` when subtitle text has not changed

**File:** `src/components/CustomPLayer/hooks/useSubtitles.js` lines 99–103

**Problem:** `setSubtitleText()` is called on every `timeupdate` event even when the displayed subtitle is the same as the previous frame. This causes an unnecessary React state update and re-render of the subtitle overlay.

**Fix:** Track the last displayed text in a ref and only call `setSubtitleText` when it changes:

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

## What to keep as-is on WebOS

- **Preview HLS instance in SeekBar** — seek thumbnails work smoothly on WebOS hardware. No need to disable or throttle.
- **Next-episode `scaleX` CSS animation** — the 10-second countdown animation runs without GPU contention on WebOS.
- **`timeupdate` firing rate** — the current ~250ms update rate is acceptable on WebOS. No throttling needed.

---

## Testing

After applying these fixes:

```bash
npm test
```

All 72 tests in `CustomPLayer` should continue to pass. Verify the subtitle overlay, seek bar, and modal open/close all behave correctly on a WebOS device or emulator.
