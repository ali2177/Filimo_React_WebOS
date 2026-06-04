import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mode: 'KeyboardMode',
    focusKeys: {},
  },
  reducers: {
    setMode(state, action) {
      state.mode = action.payload;
    },
    setFocusKey(state, action) {
      state.focusKeys[action.payload.key] = action.payload.value;
    },
    removeFocusKey(state, action) {
      delete state.focusKeys[action.payload];
    },
    clearFocusKeys(state, action) {
      action.payload.forEach(k => { delete state.focusKeys[k]; });
    },
  },
});

export const { setMode, setFocusKey, removeFocusKey, clearFocusKeys } = uiSlice.actions;
export default uiSlice.reducer;
