import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { buildApiUrl } from "@src/config/locale";
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

const User = ({ jwtSub, user, index }) => {
  const { jwt, setJwt } = useAuth();
  const { isOnline } = useOnlineStatus();
  const [isKidsLock, setIsKidsLock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const filimioFetch = useFilimioFetch();

  useDisableKeyboardWhileLoading(isLoading);
  const navigate = useNavigate();
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {},
    onEnterPress: () => {
      if (!isOnline) {
      } else {
        clearHomeNavState();
        uiStorage.removeItem("moreSingle");
        localStorage.removeItem("lastRoute");
        uiStorage.removeItem("lastSeasonFocus");
        uiStorage.removeItem("moreBtn");
        uiStorage.removeItem("seasonBtn");
        uiStorage.removeItem("recommBtn");
        uiStorage.removeItem("movie_cast_time");
        uiStorage.removeItem("movie_uid");
        uiStorage.removeItem("fromAlert");
        getUserData(jwtSub, user.attributes.level_id);
        setIsLoading(true);
        setTimeout(() => {
          navigate("/");
          setIsLoading(false);
        }, 2000);
      }

      // if (isKidsLock) {
      //   if (user.attributes.age_range === "all") {
      //     navigate("/profileLockCode");
      //   } else {
      //     getUserData(jwtSub, user.attributes.level_id, jwt);
      //     navigate("/");
      //   }
      // } else {
      //   getUserData(jwtSub, user.attributes.level_id, jwt);
      //   navigate("/");
      // }
    },
    focusKey:
      user?.attributes?.main_user === "yes"
        ? `user__main__${index}`
        : `user__other__${index}`,
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });

  const getUserData = (guid, lid) => {
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
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    setFocus(`user__main__0`);
    getUserProfileData();
  }, []);

  const getUserProfileData = async () => {
    try {
      const res = await filimioFetch(
        buildApiUrl("partner/TV/profile?devicetype=react_tizen")
      );
      const blocks = await res?.json();
      if (blocks.data.attributes.Profile_kids.kids_lock) {
        // console.log("active");
        localStorage.setItem("kids-Lock", true);
        setIsKidsLock(true);
      } else {
        // console.log("not active");
        setIsKidsLock(false);
        localStorage.setItem("kids-Lock", true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  let x;
  return (
    <div
      ref={ref}
      className={focused ? "single-user single-user-focus" : "single-user"}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={() => {
        clearHomeNavState();
        uiStorage.removeItem("moreSingle");
        localStorage.removeItem("lastRoute");
        uiStorage.removeItem("lastSeasonFocus");
        uiStorage.removeItem("moreBtn");
        uiStorage.removeItem("seasonBtn");
        uiStorage.removeItem("recommBtn");
        uiStorage.removeItem("movie_cast_time");
        uiStorage.removeItem("movie_uid");
        uiStorage.removeItem("fromAlert");
        getUserData(jwtSub, user.attributes.level_id);
        setIsLoading(true);
        setTimeout(() => {
          navigate("/");
          setIsLoading(false);
        }, 2000);
      }}
    >
      {user.attributes.avatar && (
        <img className="user-profile-pic" src={user.attributes.avatar} />
      )}
      {!user.attributes.avatar && (
        <div className="user-profile-placeholder">
          <svg
            className="user-profile-placeholder-svg"
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle
              cx="60"
              cy="60"
              r="58"
              fill="url(#paint0_radial_580_839)"
              fillOpacity="0.3"
              stroke="url(#paint1_linear_580_839)"
              strokeWidth="4"
            />
            <defs>
              <radialGradient
                id="paint0_radial_580_839"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(60 60) rotate(90) scale(60)"
              >
                <stop stopColor="#008099" />
                <stop offset="1" stopColor="#008099" stopOpacity="0.5" />
              </radialGradient>
              <linearGradient
                id="paint1_linear_580_839"
                x1="60"
                y1="0"
                x2="60"
                y2="120"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#008099" />
                <stop offset="1" stopColor="#4AE1FF" />
              </linearGradient>
            </defs>
          </svg>
          {user.attributes.name.slice(0, 1)}
        </div>
      )}
      <p className="user-profile-name u500">{user.attributes.name}</p>
    </div>
  );
};

export default User;
