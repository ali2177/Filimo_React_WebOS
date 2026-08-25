import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl, isRtl } from "@src/config/locale";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useAuth } from "@src/components/AuthProvider";
import { useOnlineStatus } from "@src/app/App";
import { useDisableKeyboardWhileLoading } from "@src/hooks/useDisableKeyboardWhileLoading";
import { useFilimioFetch } from "@src/hooks/useFilimioFetch";
import { clearHomeNavState } from "@src/utils/storageKeys";
import { uiStorage } from "@src/utils/uiStorage";
import { markProfileSelected } from "@src/utils/profileSession";
import { toFarsiDigits } from "@src/components/CustomPLayer/utils/toFarsiDigits";

/** Nav/cache state that belongs to the outgoing profile, not the incoming one. */
const STALE_KEYS = [
  "moreSingle",
  "lastSeasonFocus",
  "moreBtn",
  "seasonBtn",
  "recommBtn",
  "movie_cast_time",
  "movie_uid",
  "fromAlert",
];

export const userFocusKey = (user, index) =>
  user?.attributes?.main_user === "yes"
    ? `user__main__${index}`
    : `user__other__${index}`;

/**
 * The age band shown under a kid profile's name ("زیر ۳ سال" in the design).
 * Adult profiles report "all" and get no second line.
 */
const ageLabel = (attributes) => {
  const label = attributes?.age_range_title ?? attributes?.age_range;
  if (!label || label === "all") return null;
  return isRtl() ? toFarsiDigits(label) : label;
};

const User = ({ jwtSub, user, index }) => {
  const { setJwt } = useAuth();
  const { isOnline } = useOnlineStatus();
  const [isLoading, setIsLoading] = useState(false);
  const filimioFetch = useFilimioFetch();
  const navigate = useNavigate();

  useDisableKeyboardWhileLoading(isLoading);

  const switchProfile = useCallback(
    (guid, lid) =>
      filimioFetch(
        buildApiUrl("user/Authenticate/signin_profile?devicetype=react_tizen"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: null, guid, lid, uid: null }),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          localStorage.setItem("jwt", result.data.attributes.token);
          setJwt(result.data.attributes.token);
          markProfileSelected();
        })
        .catch((error) => console.error(error)),
    [filimioFetch, setJwt]
  );

  const handleSelect = useCallback(() => {
    if (!isOnline) return;

    clearHomeNavState();
    localStorage.removeItem("lastRoute");
    STALE_KEYS.forEach((key) => uiStorage.removeItem(key));

    switchProfile(jwtSub, user.attributes.level_id);
    setIsLoading(true);
    setTimeout(() => {
      navigate("/");
      setIsLoading(false);
    }, 2000);
  }, [isOnline, jwtSub, navigate, switchProfile, user.attributes.level_id]);

  const focusKey = userFocusKey(user, index);
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: handleSelect,
    focusable: true,
    autoRestoreFocus: true,
  });

  const name = user.attributes.name;
  const subLabel = ageLabel(user.attributes);

  return (
    <div
      ref={ref}
      className={focused ? "profile-card profile-card-focus" : "profile-card"}
      onMouseEnter={() => setFocus(focusKey)}
      onClick={handleSelect}
    >
      <div className="profile-avatar-ring">
        {user.attributes.avatar ? (
          <img className="profile-avatar" src={user.attributes.avatar} alt="" />
        ) : (
          <div className="profile-avatar-fallback u700">{name.slice(0, 1)}</div>
        )}
      </div>
      <div className="profile-labels">
        <p className="profile-name u700">{name}</p>
        {subLabel && <p className="profile-sub u700">{subLabel}</p>}
      </div>
    </div>
  );
};

export default User;
