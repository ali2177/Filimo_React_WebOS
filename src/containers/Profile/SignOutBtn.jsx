import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import { uiStorage } from "@src/utils/uiStorage";

const SignOutBtn = ({ onFocus, jwt }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      // console.log("focus");
    },
    onEnterPress: () => {
      handleSignOut();
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });
  const navigate = useNavigate();

  const handleSignOut = async () => {
    uiStorage.removeItem("lastdataloaded");
    setTimeout(() => {
      uiStorage.removeItem("lastdataloaded");
    }, 2000);
    uiStorage.removeItem("lastdataloadedIran");
    uiStorage.removeItem("lastFocusRowMoviesBeforeReload");
    uiStorage.removeItem("lastFocusRowIranBeforeReload");
    uiStorage.removeItem("lastdataloadedMovies");
    uiStorage.removeItem("lastFocusRow");
    uiStorage.removeItem("lastMovieFocus");
    const userAgent = {
      os: "WebOs",
      an: "Filimo",
      vn: "1.00",
    };
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${jwt}`);
    myHeaders.append("Cookie", "activeAbTests=null");
    myHeaders.append("UserAgent", JSON.stringify(userAgent));

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://www.filimo.com/api/fa/v1/user/Authenticate/signout",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    navigate("/");
  };

  return (
    <div
      ref={ref}
      className={focused ? "btn-back u700 btn-back-focus" : "btn-back u700"}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={handleSignOut}
    >
      خروج از حساب کاربری
    </div>
  );
};

export default SignOutBtn;
