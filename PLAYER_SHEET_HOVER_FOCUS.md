# Player Sheet — Mouse Hover Focus Change

## Goal
Make mouse hover move spatial-navigation focus onto player-sheet rows, the same
way it works elsewhere in the app (e.g. `SidebarItem`). Before this change the
sheet rows only responded to the TV remote / keyboard; the mouse pointer could
click a row but hovering it did not highlight it.

## The pattern
Each row component uses `useFocusable()` from
`@noriginmedia/norigin-spatial-navigation`. That hook returns a `focusSelf`
function. Adding an `onMouseEnter` handler that calls `focusSelf()` makes the row
take focus on hover.

For every affected row:

1. Pull `focusSelf` out of the `useFocusable(...)` return value:
   ```js
   // before
   const { ref, focused } = useFocusable({ ... });
   // after
   const { ref, focused, focusSelf } = useFocusable({ ... });
   ```

2. Add `onMouseEnter` to the row's root `<div>`:
   ```jsx
   onMouseEnter={() => focusSelf()}
   ```

3. If the row had **no** `onClick`, also add `onClick={onEnter}` so the mouse can
   select the row after hovering (only needed where noted below).

## Files changed (WebOS) — apply the same to Tizen

| File | Change |
|------|--------|
| `src/components/CustomPLayer/components/SettingsSheet/SelectRow.jsx` | `focusSelf` + `onMouseEnter` |
| `src/components/CustomPLayer/components/SettingsSheet/NavRow.jsx` | `focusSelf` + `onMouseEnter` |
| `src/components/CustomPLayer/components/SettingsSheet/ToggleRow.jsx` | `focusSelf` + `onMouseEnter` |
| `src/components/CustomPLayer/components/AudioSheet/AudioRow.jsx` | `focusSelf` + `onMouseEnter` |
| `src/components/CustomPLayer/components/EpisodeSheet/NavRow.jsx` | `focusSelf` + `onMouseEnter` |
| `src/components/CustomPLayer/components/EpisodeSheet/SeasonRow.jsx` | `focusSelf` + `onMouseEnter` |
| `src/components/CustomPLayer/components/EpisodeSheet/EpisodeRow.jsx` | `focusSelf` + `onMouseEnter` |
| `src/components/CustomPLayer/components/SubtitleSheet/SheetRow.jsx` | `focusSelf` + `onMouseEnter` **and** new `onClick={onEnter}` (had no click handler before) |

> Note: the sheet **container** components (`AudioSheet.jsx`, `EpisodeSheet.jsx`,
> `SubtitleSheet.jsx`, `PlayerSheet.jsx`, `SettingsSheet.jsx`) use `useFocusable`
> only as focus boundaries, not as hoverable rows, so they need **no** change.

## Exact diffs

### SettingsSheet/SelectRow.jsx
```diff
-  const { ref, focused } = useFocusable({
+  const { ref, focused, focusSelf } = useFocusable({
     focusKey: fk,
     onEnterPress: onEnter,
   });
   return (
     <div
       ref={ref}
       className={`st-row${focused ? " st-row-focused" : ""}`}
       style={{ backgroundColor: isActive ? "#313131" : "transparent" }}
+      onMouseEnter={() => focusSelf()}
       onClick={onEnter}
     >
```

### SettingsSheet/NavRow.jsx
```diff
-  const { ref, focused } = useFocusable({
+  const { ref, focused, focusSelf } = useFocusable({
     focusKey: fk,
     onEnterPress: onEnter,
   });
   return (
     <div
       ref={ref}
       className={`st-row st-nav-row${focused ? " st-row-focused" : ""}`}
       style={{ backgroundColor: "#313131" }}
+      onMouseEnter={() => focusSelf()}
       onClick={onEnter}
     >
```

### SettingsSheet/ToggleRow.jsx
```diff
-  const { ref, focused } = useFocusable({
+  const { ref, focused, focusSelf } = useFocusable({
     focusKey: fk,
     onEnterPress: onToggle,
   });
   return (
     <div
       ref={ref}
       className={`st-row${focused ? " st-row-focused" : ""}`}
+      onMouseEnter={() => focusSelf()}
       onClick={onToggle}
     >
```

### AudioSheet/AudioRow.jsx
```diff
-  const { ref, focused } = useFocusable({ focusKey: fk, onEnterPress: onEnter });
+  const { ref, focused, focusSelf } = useFocusable({ focusKey: fk, onEnterPress: onEnter });
   return (
     <div
       ref={ref}
       className={`as-row${focused ? " as-row-focused" : ""}${isActive ? " as-row-active" : ""}`}
       style={{ backgroundColor: isActive ? "#313131" : "transparent" }}
+      onMouseEnter={() => focusSelf()}
       onClick={onEnter}
     >
```

### EpisodeSheet/NavRow.jsx
```diff
-  const { ref, focused } = useFocusable({
+  const { ref, focused, focusSelf } = useFocusable({
     focusKey: fk,
     onEnterPress: onEnter,
   });
   return (
     <div
       ref={ref}
       className={`es-row es-nav-row${focused ? " es-row-focused" : ""}`}
       style={{ backgroundColor: "#313131" }}
+      onMouseEnter={() => focusSelf()}
       onClick={onEnter}
     >
```

### EpisodeSheet/SeasonRow.jsx
```diff
-  const { ref, focused } = useFocusable({
+  const { ref, focused, focusSelf } = useFocusable({
     focusKey: fk,
     onEnterPress: onEnter,
   });
   return (
     <div
       ref={ref}
       className={`es-row${focused ? " es-row-focused" : ""}`}
       style={{ backgroundColor: isActive ? "#313131" : "transparent" }}
+      onMouseEnter={() => focusSelf()}
       onClick={onEnter}
     >
```

### EpisodeSheet/EpisodeRow.jsx
```diff
-  const { ref, focused } = useFocusable({
+  const { ref, focused, focusSelf } = useFocusable({
     onFocus: () => {
       handleScrolling();
     },
     focusKey: fk,
     onEnterPress: onEnter,
   });
   ...
       className={`es-row${focused ? " es-row-focused" : ""}${isPlaying ? " es-row-playing" : ""}`}
+      onMouseEnter={() => focusSelf()}
       onClick={onEnter}
     >
```

### SubtitleSheet/SheetRow.jsx
```diff
-  const { ref, focused } = useFocusable({
+  const { ref, focused, focusSelf } = useFocusable({
     focusKey: fk,
     onEnterPress: onEnter,
     onArrowPress: (dir) => {
       ...
     },
   });
   ...
       className={`ss-row${focused ? " ss-row-focused" : ""}`}
       style={{ backgroundColor: leftIcon ? "#313131" : "none" }}
+      onMouseEnter={() => focusSelf()}
+      onClick={onEnter}
     >
```

## Notes for the Tizen port
- File paths may differ if the Tizen player lives under a different folder (the
  WebOS player is under `src/components/CustomPLayer/`). Match by component name
  / class names (`st-row`, `as-row`, `es-row`, `ss-row`) if the paths differ.
- `setFocus(focusKey)` is an equivalent alternative to `focusSelf()` if a row
  doesn't expose `focusSelf` for some reason — both are from
  `@noriginmedia/norigin-spatial-navigation`. This is the same hover pattern used
  in `src/components/Sidebar/SidebarItem.jsx`.
