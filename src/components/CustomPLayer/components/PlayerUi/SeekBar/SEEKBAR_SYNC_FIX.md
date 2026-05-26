# SeekBar Sync Fix — Porting Guide

## Problem

The seekbar had three de-sync bugs where the white circle (thumb), white progress bar, and current-time label did not move together:

| Scenario | Thumb | Progress bar | Time label |
|---|---|---|---|
| Mouse click | stayed at old position until `timeupdate` | stayed at old position until `timeupdate` | stayed at old time |
| Keyboard arrow hold | moved instantly (correct) | lagged behind, waiting for `timeupdate` | lagged behind |
| Normal playback | correct | correct | correct |

Root cause: `currentTime` (and `playedPercent` derived from it) only updates when the browser fires a `timeupdate` event (~250 ms cadence). The thumb and bar were reading from different sources, so they drifted apart during fast interaction.

---

## The Fix — Three Steps

### Step 1 — Add `seekPending` state for instant mouse-click feedback

When the user clicks the seek bar, immediately store the clicked position as a percentage. Both the bar and thumb read this value until the video catches up, then it clears automatically.

```js
// ADD this state alongside the existing scrubTime state
const [seekPending, setSeekPending] = useState(null);
```

```js
// ADD this effect to auto-clear seekPending once the video catches up
useEffect(() => {
  if (seekPending !== null && Math.abs(playedPercent - seekPending) < 1) {
    setSeekPending(null);
  }
}, [playedPercent, seekPending]);
```

```js
// CHANGE the onClick handler — add setSeekPending alongside the existing currentTime update
onClick={(e) => {
  const rect  = e.currentTarget.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  const v     = videoRef.current;
  if (v && duration) {
    v.currentTime = ratio * duration;
    setSeekPending(ratio * 100); // <-- ADD THIS LINE
    resetUiTimer();
  }
}}
```

### Step 2 — Introduce a single `activePercent` that drives everything

Replace the old per-element percent calculations with one value that both the bar and thumb always read from:

```js
// These existing lines stay the same:
const playedPercent = duration ? (currentTime / duration) * 100 : 0;
const scrubPercent  = duration ? (scrubTime   / duration) * 100 : 0;

// ADD these three lines after the two above:
const displayPercent = seekPending ?? playedPercent;       // mouse mode: instant on click
const activePercent  = focused ? scrubPercent : displayPercent; // keyboard mode: instant on arrow
const activeTime     = duration ? (activePercent / 100) * duration : 0;
```

| Mode | `activePercent` source | Updates instantly? |
|---|---|---|
| Normal playback | `playedPercent` (from `currentTime`) | Yes, via `timeupdate` |
| Mouse click | `seekPending` (set in onClick) | Yes — same frame |
| Keyboard arrow | `scrubPercent` (from `scrubTime` state) | Yes — same frame |

### Step 3 — Wire all three visual elements to `activePercent` / `activeTime`

```jsx
// Progress bar — CHANGE playedPercent → activePercent
<div className="progress-played"
     style={{ transform: `scaleX(${activePercent / 100})` }} />

// Thumb circle — CHANGE thumbPercent → activePercent
<div className="progress-thumb ..."
     style={{ left: `${activePercent}%` }} />

// Current-time label — CHANGE currentTime → activeTime
<span>{formatTime(activeTime)}</span>
```

---

## Before / After Summary

```
BEFORE                              AFTER
──────────────────────────────────  ──────────────────────────────────
thumbPercent  = focused             activePercent = focused
                ? scrubPercent                    ? scrubPercent
                : playedPercent                   : (seekPending ?? playedPercent)

bar  → playedPercent  (lags)        bar  → activePercent  (instant)
thumb→ thumbPercent   (mixed)       thumb→ activePercent  (instant)
label→ currentTime    (lags)        label→ activeTime     (instant)
```

---

## Applying to WebOS Version

Find your seekbar component and make the same three changes:

1. **State**: add `seekPending` state (initialized to `null`).
2. **Click handler**: after setting `video.currentTime`, call `setSeekPending(ratio * 100)`.
3. **Render**: replace all three separate percent/time values with `activePercent` / `activeTime` computed as shown above. The mouse-hover behavior needs no change — there is intentionally **no** `onMouseMove` handler; the thumb should never follow the cursor freely.
