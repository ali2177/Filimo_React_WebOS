# Back Button Key Code Expansion

This document describes the changes made to support additional TV remote back-button key codes alongside the standard `Backspace` key. Apply these changes to any other platform version (e.g. WebOS) that shares the same player codebase.

---

## Why

Different TV platforms fire different `keyCode` values for their physical Back button:

| keyCode | Platform |
|---|---|
| `8` | Standard Backspace (keyboard) |
| `10009` | Samsung Tizen back button |
| `187` | Some TV remote back keys |
| `461` | LG WebOS back button |

Previously the code only checked `e.key === "Backspace"`, which does not catch the hardware back button on LG WebOS (`461`) or Samsung Tizen (`10009`).

---

## Step 1 — Add the `isBackKey` helper

**File:** `src/components/CustomPLayer/utils/utils.js`

Add these two lines at the top of the file (after any existing comment):

```js
const BACK_KEY_CODES = new Set([8, 10009, 187, 461]);
export const isBackKey = (e) =>
  e.key === "Backspace" || BACK_KEY_CODES.has(e.keyCode);
```

---

## Step 2 — Update the global keyboard handler

**File:** `src/components/CustomPLayer/hooks/usePlayerKeyboard.js`

1. Add the import at the top:
```js
import { isBackKey } from "../utils/utils";
```

2. Replace all `e.key === "Backspace"` / `e.key !== "Backspace"` checks with `isBackKey(e)` / `!isBackKey(e)`.

Before:
```js
if (e.key !== "Backspace") resetUiTimer();
// …
case "Backspace":
  if (uiVisible) { … }
  break;
```

After:
```js
if (!isBackKey(e)) resetUiTimer();
// …
if (isBackKey(e)) {
  if (uiVisible) { … }
  return;
}
```

---

## Step 3 — Update each modal's capture-phase handler

All four modals and the Next Episode button register a capture-phase `keydown` listener to intercept the Back key before the global handler fires. Update each file the same way:

### 3a. SettingsSheet
**File:** `src/components/CustomPLayer/components/SettingsSheet/SettingsSheet.jsx`

Add import:
```js
import { isBackKey } from "../../utils/utils";
```

Replace:
```js
if (e.key !== "Backspace") return;
```
With:
```js
if (!isBackKey(e)) return;
```

---

### 3b. EpisodeSheet
**File:** `src/components/CustomPLayer/components/EpisodeSheet/EpisodeSheet.jsx`

Add import:
```js
import { isBackKey } from "../../utils/utils";
```

Replace:
```js
if (e.key !== "Backspace") return;
```
With:
```js
if (!isBackKey(e)) return;
```

---

### 3c. AudioSheet
**File:** `src/components/CustomPLayer/components/AudioSheet/AudioSheet.jsx`

Add import:
```js
import { isBackKey } from "../../utils/utils";
```

Replace:
```js
if (e.key !== "Backspace") return;
```
With:
```js
if (!isBackKey(e)) return;
```

---

### 3d. SubtitleSheet
**File:** `src/components/CustomPLayer/components/SubtitleSheet/SubtitleSheet.jsx`

Add import:
```js
import { isBackKey } from "../../utils/utils";
```

Replace:
```js
if (e.key === "Backspace") {
```
With:
```js
if (isBackKey(e)) {
```

---

### 3e. NextEpisodeButton
**File:** `src/components/CustomPLayer/components/NextEpisodeButton/NextEpisodeButton.jsx`

Add import:
```js
import { isBackKey } from "../../utils/utils";
```

Replace:
```js
if (e.key === "Backspace") {
```
With:
```js
if (isBackKey(e)) {
```

---

## Summary of changed files

| File | Change |
|---|---|
| `utils/utils.js` | Added `isBackKey` helper export |
| `hooks/usePlayerKeyboard.js` | Uses `isBackKey` for back-button detection |
| `components/SettingsSheet/SettingsSheet.jsx` | Uses `isBackKey` in capture handler |
| `components/EpisodeSheet/EpisodeSheet.jsx` | Uses `isBackKey` in capture handler |
| `components/AudioSheet/AudioSheet.jsx` | Uses `isBackKey` in capture handler |
| `components/SubtitleSheet/SubtitleSheet.jsx` | Uses `isBackKey` in capture handler |
| `components/NextEpisodeButton/NextEpisodeButton.jsx` | Uses `isBackKey` in capture handler |
