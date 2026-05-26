import React, { useEffect, useState } from "react";
import { useGetUsersProfileQuery } from "../../services/TMDB";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader/Loader";
import User from "./User";
import NetworkError from "../NetworkError/NetworkError";

const UsersProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ref, focusKey, focusSelf, focused } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });
  const [jwtToken, setJwtToken] = useState(null);
  const [jwtSub, setJwtSub] = useState(null);
  const { data, error, isFetching } = useGetUsersProfileQuery({ jwtSub });
  let jwt = localStorage.getItem("jwt");
  function decodeJwtToken(token) {
    const arrayToken = token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    return tokenPayload.sub;
  }

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);
  useEffect(() => {
    if (jwt) {
      setJwtSub(decodeJwtToken(jwt));
    }

    // console.log(decodeJwtToken(jwt));

    // if (jwt) {
    //   try {
    //     const decoded = jwt.decode(jwtToken);
    //     const sub = decoded.sub;
    //     console.log("Subject (sub):", sub);
    //   } catch (err) {
    //     console.error("Error decoding token:", err);
    //   }
    // }
  }, [jwt]);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      localStorage.removeItem("searchQuery");
      localStorage.removeItem("searchResult");
      if (location.pathname !== "/player") navigate(-1);
    }
  };

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      <main className="users-prfile">
        <div className="users-prfile-content">
          <p className="users-prfile-content-header u700">
            چه کسی تماشا می کند ؟
          </p>
          <div ref={ref} className="users-prfile-wrraper">
            {data?.data.map((user, index) => (
              <User index={index} jwtSub={jwtSub} user={user} />
            ))}
          </div>
        </div>
      </main>
    </FocusContext.Provider>
  );
};

export default UsersProfile;
