// Tracks whether the signed-in account has picked a profile in this session.
//
// Plain localStorage rather than uiStorage/Redux on purpose: the startup gate in
// App.jsx reads it before the first render, and it has to survive a reload — the
// same reasoning as `jwt` and `language` (see src/utils/uiStorage.js).

export const PROFILE_SELECTED_KEY = "profile_selected";

export function hasSelectedProfile() {
  try {
    return localStorage.getItem(PROFILE_SELECTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markProfileSelected() {
  try {
    localStorage.setItem(PROFILE_SELECTED_KEY, "1");
  } catch {
    /* storage unavailable — the gate simply asks again next launch */
  }
}

export function clearProfileSelected() {
  try {
    localStorage.removeItem(PROFILE_SELECTED_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
}
