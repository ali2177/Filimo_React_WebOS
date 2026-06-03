const BACK_KEY_CODES = new Set([8, 10009, 187, 461]);
export const isBackKey = (e) =>
  e.key === "Backspace" || BACK_KEY_CODES.has(e.keyCode);
