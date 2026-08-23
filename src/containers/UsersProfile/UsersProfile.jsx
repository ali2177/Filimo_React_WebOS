import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useBackKey } from "@src/hooks/useBackKey";
import { buildApiUrl } from "@src/config/locale";
import { useFilimioFetch } from "@src/hooks/useFilimioFetch";
import { useSignOut } from "@src/hooks/useSignOut";
import Loader from "@src/components/Loader/Loader";
import NetworkError from "@src/components/NetworkError/NetworkError";
import ConfirmDialog from "@src/components/ConfirmDialog/ConfirmDialog";
import { useGetUsersProfileQuery } from "../../services/TMDB";
import User, { userFocusKey } from "./User";
import AddProfileCard, { MAX_PROFILES } from "./AddProfileCard";
import ProfileActionButton from "./ProfileActionButton";
import PersonIcon from "./PersonIcon";
import "./UsersProfile.css";

const LOGO_SRC =
  "https://www.filimo.com/assets/app/filimo/android/nlogo_tv/ic_filimo_banner_v3.webp";

const ACCOUNT_FOCUS_KEY = "profiles-account";
const SIGNOUT_FOCUS_KEY = "profiles-signout";

function decodeJwtSub(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
}

const UsersProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const filimioFetch = useFilimioFetch();
  const signOut = useSignOut();

  const { ref, focusKey } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  const jwt = localStorage.getItem("jwt");
  const jwtSub = useMemo(() => (jwt ? decodeJwtSub(jwt) : null), [jwt]);
  const [showSignOut, setShowSignOut] = useState(false);

  // `skip` matters: without it the query fires once with guid=null before the
  // token is decoded, and that response is cached against a useless key.
  const { data, error, isFetching } = useGetUsersProfileQuery(
    { jwtSub },
    { skip: !jwtSub }
  );

  const profiles = data?.data;

  // Kids-lock flag for the account. Fetched once here rather than once per
  // profile tile, which is what the old per-tile mount effect did.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await filimioFetch(
          buildApiUrl("partner/TV/profile?devicetype=react_tizen")
        );
        const blocks = await res?.json();
        if (cancelled) return;
        const locked = Boolean(
          blocks?.data?.attributes?.Profile_kids?.kids_lock
        );
        localStorage.setItem("kids-Lock", locked);
      } catch (e) {
        // Non-fatal: the App-level profile poll refreshes this flag anyway.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filimioFetch]);

  // Land on the account's main profile once the list arrives.
  useEffect(() => {
    if (!profiles?.length) return;
    const mainIndex = profiles.findIndex(
      (user) => user?.attributes?.main_user === "yes"
    );
    const index = mainIndex === -1 ? 0 : mainIndex;
    const id = setTimeout(
      () => setFocus(userFocusKey(profiles[index], index)),
      10
    );
    return () => clearTimeout(id);
  }, [profiles]);

  const handleBack = useCallback(() => {
    localStorage.removeItem("searchQuery");
    localStorage.removeItem("searchResult");
    navigate(-1);
  }, [navigate]);

  // The dialog owns Back while it is open.
  useBackKey(handleBack, { enabled: !showSignOut });

  const closeSignOut = useCallback(() => {
    setShowSignOut(false);
    setFocus(SIGNOUT_FOCUS_KEY);
  }, []);

  // No decodable token means there is nothing to list — surface it instead of
  // spinning forever on a query that is permanently skipped.
  if (error || !jwtSub) return <NetworkError />;
  if (isFetching) return <Loader />;
  if (!profiles) return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      {/* The boundary ref goes on the page, not the row: norigin measures
          `isFocusBoundary` against this node's box, so anchoring it to the row
          would make the action buttons below unreachable. */}
      <main ref={ref} className="profiles-page">
        <div className="profiles-logo">
          <img src={LOGO_SRC} alt="" />
        </div>

        <h1 className="profiles-title u700">{t("profiles.whoIsWatching")}</h1>

        <div className="profiles-row">
          {profiles.map((user, index) => (
            <User
              key={user.attributes?.level_id ?? index}
              index={index}
              jwtSub={jwtSub}
              user={user}
            />
          ))}
          {profiles.length < MAX_PROFILES && <AddProfileCard />}
        </div>

        <div className="profiles-actions">
          <ProfileActionButton
            focusKey={ACCOUNT_FOCUS_KEY}
            label={t("profiles.account")}
            icon={<PersonIcon />}
            onEnterPress={() => navigate("/profile")}
          />
          <ProfileActionButton
            focusKey={SIGNOUT_FOCUS_KEY}
            label={t("profiles.signOut")}
            ghost
            onEnterPress={() => setShowSignOut(true)}
          />
        </div>

        {showSignOut && (
          <ConfirmDialog
            title={t("profiles.signOutTitle")}
            message={t("profiles.signOutMessage")}
            confirmText={t("profiles.yes")}
            cancelText={t("profiles.no")}
            onConfirm={signOut}
            onCancel={closeSignOut}
          />
        )}
      </main>
    </FocusContext.Provider>
  );
};

export default UsersProfile;
