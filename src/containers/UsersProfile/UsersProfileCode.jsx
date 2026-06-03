import React, { useEffect, useState, useCallback } from "react";
import { useBackKey } from "@src/hooks/useBackKey";
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
import Loader from "@src/components/Loader/Loader";
import User from "./User";

const UsersProfileCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ref, focusKey, focusSelf, focused } = useFocusable();
  const [jwtToken, setJwtToken] = useState(null);
  const [jwtSub, setJwtSub] = useState(null);
  const { data, error, isFetching } = useGetUsersProfileQuery({ jwtSub });
  let jwt = localStorage.getItem("jwt");
  function decodeJwtToken(token) {
    const arrayToken = token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    return tokenPayload.sub;
  }

  const handleBack = useCallback(() => {
    if (location.pathname !== "/player") navigate(-1);
  }, [location.pathname, navigate]);

  useBackKey(handleBack);
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


  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      <main className="users-prfile">
        <div className="users-prfile-content">
          <p className="users-prfile-content-header u700">
            تغییر تماشا از حالت کودک به بزرگسال، به اجازه شما نیاز دارد.
          </p>
          <p className="users-prfile-content-header u700">
            کد تاییدی که برای شماره {+localStorage.getItem("mobile_number")} اس
            ام اس شده را وارد کنید تا به تغییر تماشا از حالت کودک به بزرگسال
            اجازه دهید.
          </p>
          <div className="code-row">
            <input className="code-input" type="number" />
            <input className="code-input" type="number" />
            <input className="code-input" type="number" />
            <input className="code-input" type="number" />
            <input className="code-input" type="number" />
            <input className="code-input" type="number" />
          </div>
        </div>
      </main>
    </FocusContext.Provider>
  );
};

export default UsersProfileCode;
