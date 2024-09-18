import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const User = ({ jwtSub, user }) => {
  let jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {},
    onEnterPress: () => {
      getUserData(jwtSub, user.attributes.level_id, jwt);
      navigate("/");
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });

  const getUserData = (guid, lid, jwt) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${jwt}`);

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
      "https://www.filimo.com/api/fa/v1/user/Authenticate/signin_profile",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) =>
        localStorage.setItem("jwt", result.data.attributes.token)
      )
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    focusSelf();
  }, []);
  let x;
  return (
    <div
      ref={ref}
      className={focused ? "single-user single-user-focus" : "single-user"}
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
              fill-opacity="0.3"
              stroke="url(#paint1_linear_580_839)"
              stroke-width="4"
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
                <stop stop-color="#008099" />
                <stop offset="1" stop-color="#008099" stop-opacity="0.5" />
              </radialGradient>
              <linearGradient
                id="paint1_linear_580_839"
                x1="60"
                y1="0"
                x2="60"
                y2="120"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#008099" />
                <stop offset="1" stop-color="#4AE1FF" />
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
