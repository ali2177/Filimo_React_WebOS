# Subtitle Settings Fix — WebOS (apply to Tizen)

Three bugs fixed in the subtitle settings panel. All root causes are norigin spatial-navigation quirks plus a WebOS synthetic-click problem.

---

## Bug 1 — Arrow keys and Enter do nothing on settings rows (especially the middle row)

### Root cause
When a `useFocusable` container has `trackChildren: true` + `isFocusBoundary: true`, norigin's internal `onEnterPress` / `onArrowPress` callbacks do not fire reliably for child rows — particularly the ones that are not the first child. The `focused` boolean returned by `useFocusable` IS updated correctly (the visual highlight works), but the action callbacks are not called.

### Fix — bypass norigin entirely: capture-phase keyboard handler

Instead of relying on norigin's `onEnterPress` / `onArrowPress`, intercept all relevant keys (Back, ArrowLeft, ArrowRight, Enter) in a **capture-phase** `keydown` listener on `SubtitleSheet`. Capture phase fires before norigin's bubble-phase listener, and `stopImmediatePropagation()` prevents norigin from processing the key at all.

### Fix — track focused row with a ref, not `getCurrentFocusKey()`

`getCurrentFocusKey()` from norigin may return the container key instead of the child key. Instead, keep a `currentFocusKeyRef` that is updated by each settings row whenever it becomes focused. The reliable trigger is a `useEffect` watching the `focused` boolean (not norigin's `onFocus` callback option, which also does not fire for middle rows).

---

## Bug 2 — Pressing OK/Enter disables the subtitle (WebOS only)

### Root cause
WebOS TV remotes generate a **synthetic mouse click** at the last cursor position when the OK button is pressed — not at the focused element. If the cursor was over the `player-sheet-overlay` backdrop div, and that div had `onClick={onClose}`, the modal closed. The user saw this as "subtitle got turned off."

### Fix
Remove `onClick={onClose}` from the overlay backdrop in `PlayerSheet.jsx`. The Back key handler in SubtitleSheet already closes the sheet correctly.

---

## Files changed

### 1. `PlayerSheet.jsx`

**Before:**
```jsx
<div className="player-sheet-overlay" onClick={onClose}>
  <div className="player-sheet" onClick={(e) => e.stopPropagation()}>
```

**After:**
```jsx
<div className="player-sheet-overlay">
  <div className="player-sheet">
```

---

### 2. `SheetRow.jsx`

Add `onFocus` prop and trigger it via `useEffect` watching the `focused` boolean. Do **not** pass `onFocus` into `useFocusable` — that callback option does not fire reliably.

**Before:**
```jsx
import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const SheetRow = ({ focusKey: fk, label, subLabel, leftIcon, onEnter, onLeft, onRight, onUp, onDown }) => {
  const { ref, focused } = useFocusable({
    focusKey: fk,
    onEnterPress: onEnter,
    onArrowPress: (dir) => {
      if (dir === "left" && onLeft) onLeft();
      if (dir === "right" && onRight) onRight();
    },
  });

  return (
    <div ref={ref} className={`ss-row${focused ? " ss-row-focused" : ""}`} onClick={onEnter}>
      ...
      {subLabel && (
        <span className={`ss-row${focused ? "ss-row-sublabel ss-row-sublabel-focused u400" : "ss-row-sublabel u400"}`}>
```

**After:**
```jsx
import React, { useEffect } from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const SheetRow = ({ focusKey: fk, label, subLabel, leftIcon, onEnter, onLeft, onRight, onUp, onDown, onFocus }) => {
  const { ref, focused } = useFocusable({
    focusKey: fk,
    onEnterPress: onEnter,
    onArrowPress: (dir) => {
      if (dir === "left") { if (onLeft) onLeft(); return false; }
      if (dir === "right") { if (onRight) onRight(); return false; }
    },
  });

  // onFocus via useEffect — do NOT pass onFocus into useFocusable(), it won't fire for middle rows
  useEffect(() => {
    if (focused && onFocus) onFocus();
  }, [focused]);

  return (
    <div ref={ref} className={`ss-row${focused ? " ss-row-focused" : ""}`}>
      // no onClick — WebOS generates synthetic clicks at cursor position, not at focused element
      ...
      {subLabel && (
        <span className={`ss-row-sublabel${focused ? " ss-row-sublabel-focused" : ""} u400`}>
        // note: broken template literal fixed — was missing the space before "ss-row-sublabel"
```

Key changes:
- Add `useEffect` watching `focused` → calls `onFocus()` when row gains focus
- Remove `onClick={onEnter}` from the div (WebOS synthetic click bug)
- `onArrowPress` returns `false` to prevent norigin from also moving focus after handling
- Fix broken `subLabel` className template literal (was missing a space separator)

---

### 3. `SubtitleSheet.jsx`

The main change: all key handling for the settings layer moves into one capture-phase `keydown` handler.

**Key additions:**

#### a) Track focused row with a ref
```jsx
const currentFocusKeyRef = useRef(null);
```

When entering the settings layer, initialise it:
```jsx
useEffect(() => {
  if (layer === "settings") {
    currentFocusKeyRef.current = "ss-textcolor";
    setFocus("ss-textcolor");
  }
}, [layer]);
```

Pass `onFocus` to each settings `SheetRow` to keep the ref current as the user navigates:
```jsx
<SheetRow
  focusKey="ss-textcolor"
  onFocus={() => { currentFocusKeyRef.current = "ss-textcolor"; }}
  onEnter={...}
/>
<SheetRow
  focusKey="ss-textsize"
  onFocus={() => { currentFocusKeyRef.current = "ss-textsize"; }}
  onEnter={...}
/>
<SheetRow
  focusKey="ss-background"
  onFocus={() => { currentFocusKeyRef.current = "ss-background"; }}
  onEnter={...}
/>
<SheetRow
  focusKey="ss-reset"
  onFocus={() => { currentFocusKeyRef.current = "ss-reset"; }}
  onEnter={...}
/>
```

#### b) Action handler ref (updated every render — no deps array)
Closures over `setSubtitleStyle` must always be fresh; a no-deps `useEffect` re-assigns the ref after every render:
```jsx
const settingsArrowHandlersRef = useRef({});
useEffect(() => {
  settingsArrowHandlersRef.current = {
    "ss-textcolor": {
      left:  () => setSubtitleStyle((s) => ({ ...s, color: cycle(TEXT_COLORS, s.color, -1) })),
      right: () => setSubtitleStyle((s) => ({ ...s, color: cycle(TEXT_COLORS, s.color,  1) })),
      enter: () => setSubtitleStyle((s) => ({ ...s, color: cycle(TEXT_COLORS, s.color,  1) })),
    },
    "ss-textsize": {
      left:  () => setSubtitleStyle((s) => ({ ...s, size: cycle(TEXT_SIZES, s.size, -1) })),
      right: () => setSubtitleStyle((s) => ({ ...s, size: cycle(TEXT_SIZES, s.size,  1) })),
      enter: () => setSubtitleStyle((s) => ({ ...s, size: cycle(TEXT_SIZES, s.size,  1) })),
    },
    "ss-background": {
      left:  () => setSubtitleStyle((s) => ({ ...s, background: cycle(BG_OPTIONS, s.background, -1) })),
      right: () => setSubtitleStyle((s) => ({ ...s, background: cycle(BG_OPTIONS, s.background,  1) })),
      enter: () => setSubtitleStyle((s) => ({ ...s, background: cycle(BG_OPTIONS, s.background,  1) })),
    },
    "ss-reset": {
      enter: () => setSubtitleStyle(DEFAULT_STYLE),
    },
  };
}); // no deps — refreshes every render so closures are always fresh
```

#### c) Capture-phase keyboard handler
Intercepts Back, arrows, and Enter before norigin sees them:
```jsx
useEffect(() => {
  const handler = (e) => {
    // Back key — closes sheet or returns to main layer
    if (isBackKey(e)) {
      e.stopImmediatePropagation();
      if (layer === "settings") {
        setLayer("main");
      } else {
        setShowSubtitlePreview(false);
        onClose();
      }
      return;
    }

    // All action keys in settings layer
    if (layer === "settings") {
      const isLeft  = e.key === "ArrowLeft"  || e.keyCode === 37;
      const isRight = e.key === "ArrowRight" || e.keyCode === 39;
      const isEnter = e.key === "Enter"      || e.keyCode === 13;
      if (isLeft || isRight || isEnter) {
        e.stopImmediatePropagation(); // prevents norigin from also processing the key
        const fk = currentFocusKeyRef.current;
        const h = settingsArrowHandlersRef.current[fk];
        if (h) {
          if (isLeft) h.left?.();
          else if (isRight) h.right?.();
          else h.enter?.();
        }
        return;
      }
    }
  };

  window.addEventListener("keydown", handler, true); // true = capture phase
  return () => window.removeEventListener("keydown", handler, true);
}, [layer, onClose, subtitles]);
```

#### d) Container — remove left/right from focus boundary
**Before:** `focusBoundaryDirections: ["left", "right", "up", "down"]`
**After:** `focusBoundaryDirections: ["up", "down"]`

Left/right are handled entirely by the capture handler; the container boundary no longer needs to block them.

---

## Summary of the pattern (for Tizen)

When norigin's callbacks are unreliable inside a `trackChildren` / `isFocusBoundary` container:

1. Move **all** key handling for that panel into a single **capture-phase** `keydown` listener.
2. Track which row is focused with a **ref**, updated by `useEffect(() => { if (focused) onFocus(); }, [focused])` in the row component — not via norigin's `onFocus` option.
3. Store action callbacks in a **ref updated every render** (no-deps `useEffect`) so closures over state are always fresh.
4. Call `stopImmediatePropagation()` so norigin never sees the key.
5. Remove any `onClick` handlers from the panel overlay/backdrop — TV remotes fire synthetic clicks at cursor position, not at the focused element.
