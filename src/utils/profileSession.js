// Tracks whether the signed-in account has picked a profile in this session.
//
// Plain localStorage rather than uiStorage/Redux on purpose: the startup gate in
// App.jsx reads it before the first render, and it has to survive a reload — the
// same reasoning as `jwt` and `language` (see src/utils/uiStorage.js).

export const PROFILE_SELECTED_KEY = "profile_selected";

// The picked profile's display name and avatar. The menu API's profile item
// only ships the account-level label ("مدیریت اعضا") and a generic avatar, but
// the navbar head block shows the active profile — so stash it at pick time,
// which is the only moment those values are in hand (see UsersProfile/User.jsx).
export const PROFILE_IDENTITY_KEY = "profile_identity";

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
    localStorage.removeItem(PROFILE_IDENTITY_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
}

export function setSelectedProfile({ name, avatar }) {
  try {
    localStorage.setItem(
      PROFILE_IDENTITY_KEY,
      JSON.stringify({ name: name || "", avatar: avatar || "" })
    );
  } catch {
    /* storage unavailable — the navbar falls back to the API's label */
  }
}

export function getSelectedProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_IDENTITY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Unavailable or corrupt — treat as "not known" so callers fall back.
    return null;
  }
}
