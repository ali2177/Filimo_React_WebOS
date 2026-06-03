import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useAuth } from "../AuthProvider";
import { useOnlineStatus } from "../App";

const User = ({ jwtSub, user, index }) => {
  const { jwt, setJwt } = useAuth();
  const { isOnline } = useOnlineStatus();
  const [isKidsLock, setIsKidsLock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // let jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoading) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isLoading]);
  const navigate = useNavigate();
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {},
    onEnterPress: () => {
      if (!isOnline) {
      } else {
        localStorage.removeItem("lastdataloaded");
        localStorage.removeItem("lastdataloadedIran");
        localStorage.removeItem("lastdataloadedMovies");
        localStorage.removeItem("lastdataloadedSeries");
        localStorage.removeItem("lastdataloadedKids");
        localStorage.removeItem("moreSingle");
        localStorage.removeItem("lastRoute");
        localStorage.removeItem("lastFocus");
        localStorage.removeItem("lastFocusMoreItem");
        localStorage.removeItem("last");
        localStorage.removeItem("lastFocusRow");
        localStorage.removeItem("lastFocusRowMoviesBeforeReload");
        localStorage.removeItem("lastFocusRowKidsBeforeReload");
        localStorage.removeItem("lastFocusRowIranBeforeReload");
        localStorage.removeItem("lastdataloadedKids");
        localStorage.removeItem("lastFocusRowBeforeReload");
        localStorage.removeItem("lastMovieFocus");
        localStorage.removeItem("lastSeasonFocus");
        localStorage.removeItem("moreBtn");
        localStorage.removeItem("seasonBtn");
        localStorage.removeItem("recommBtn");
        localStorage.removeItem("movie_cast_time");
        localStorage.removeItem("movie_uid");
        localStorage.removeItem("fromAlert");
        //  localStorage.removeItem("lastFocusMenuItem");
        getUserData(jwtSub, user.attributes.level_id, jwt);
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

  const getUserData = (guid, lid, jwt) => {
    const userAgent = {
      os: "WebOs",
      an: "Filimo",
      vn: "1.00",
    };
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${jwt}`);
    myHeaders.append("UserAgent", JSON.stringify(userAgent));

    const raw = JSON.stringify({
      code: null,
      guid: guid,
      lid: lid,
      uid: null,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://www.filimo.com/api/fa/v1/user/Authenticate/signin_profile?devicetype=react_tizen",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        localStorage.removeItem("MenuData");
        localStorage.setItem("jwt", result.data.attributes.token);
        setJwt(result.data.attributes.token);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    setFocus(`user__main__0`);
    getUserProfileData(jwt);
  }, []);

  const getUserProfileData = async (jwt) => {
    try {
      const userAgent = {
        os: "WebOs",
        an: "Filimo",
        vn: "1.00",
      };
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/partner/TV/profile?devicetype=react_tizen`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            UserAgent: JSON.stringify(userAgent),
          },
        }
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
        localStorage.removeItem("lastdataloaded");
        localStorage.removeItem("lastdataloadedIran");
        localStorage.removeItem("lastdataloadedMovies");
        localStorage.removeItem("lastdataloadedSeries");
        localStorage.removeItem("lastdataloadedKids");
        localStorage.removeItem("moreSingle");
        localStorage.removeItem("lastRoute");
        localStorage.removeItem("lastFocus");
        localStorage.removeItem("lastFocusMoreItem");
        localStorage.removeItem("last");
        localStorage.removeItem("lastFocusRow");
        localStorage.removeItem("lastFocusRowMoviesBeforeReload");
        localStorage.removeItem("lastFocusRowKidsBeforeReload");
        localStorage.removeItem("lastFocusRowIranBeforeReload");
        localStorage.removeItem("lastdataloadedKids");
        localStorage.removeItem("lastFocusRowBeforeReload");
        localStorage.removeItem("lastMovieFocus");
        localStorage.removeItem("lastSeasonFocus");
        localStorage.removeItem("moreBtn");
        localStorage.removeItem("seasonBtn");
        localStorage.removeItem("recommBtn");
        localStorage.removeItem("movie_cast_time");
        localStorage.removeItem("movie_uid");
        localStorage.removeItem("fromAlert");
        getUserData(jwtSub, user.attributes.level_id, jwt);
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
