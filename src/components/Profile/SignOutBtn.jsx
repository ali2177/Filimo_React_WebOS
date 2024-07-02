import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    focusSelf();
  }, []);

  const handleSignOut = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${jwt}`);
    myHeaders.append("Cookie", "activeAbTests=null");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://www.televika.com/api/fa/v1/user/Authenticate/signout",
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
    >
      <p className="u700">خروج از حساب کاربری</p>
    </div>
  );
};

export default SignOutBtn;
