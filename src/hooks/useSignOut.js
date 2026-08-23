import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "@src/config/locale";
import { useAuth } from "@src/components/AuthProvider";
import { useFilimioFetch } from "@src/hooks/useFilimioFetch";
import { uiStorage } from "@src/utils/uiStorage";
import { clearHomeNavState } from "@src/utils/storageKeys";
import { PROFILE_SELECTED_KEY } from "@src/utils/profileSession";

/**
 * Single sign-out path, shared by the account page and the profile picker.
 *
 * Note the local credential clear: hitting /signout only invalidates the token
 * server-side. Without also dropping `jwt` from localStorage and from the auth
 * context, the app keeps behaving as if the user were still signed in until the
 * next profile poll happens to notice.
 */
export function useSignOut() {
  const { setJwt } = useAuth();
  const filimioFetch = useFilimioFetch();
  const navigate = useNavigate();

  return useCallback(async () => {
    clearHomeNavState();
    uiStorage.removeItem("lastdataloadedIran");
    uiStorage.removeItem("lastFocusRowMoviesBeforeReload");
    uiStorage.removeItem("lastFocusRowIranBeforeReload");
    uiStorage.removeItem("lastdataloadedMovies");
    uiStorage.removeItem("lastMovieFocus");

    try {
      await filimioFetch(buildApiUrl("user/Authenticate/signout"));
    } catch (e) {
      // Network failure still signs the user out locally — the token is
      // discarded either way, so there is nothing useful to recover here.
    }

    localStorage.removeItem("jwt");
    localStorage.removeItem(PROFILE_SELECTED_KEY);
    setJwt(null);
    navigate("/");
  }, [filimioFetch, navigate, setJwt]);
}
