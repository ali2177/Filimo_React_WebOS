import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import SignOutBtn from "./SignOutBtn";

function Profile() {
  const { ref, focusKey, focusSelf, focused } = useFocusable();
  const navigate = useNavigate();
  const [UserData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  let jwt = localStorage.getItem("jwt");

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      navigate(-1);
    }
  };

  //recive user data if log in
  const getUserData = async (jwt) => {
    try {
      const res = await fetch(
        `https://www.televika.com/api/fa/v1/partner/TV/profile`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const blocks = await res?.json();
      setUserData(blocks);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // focusSelf();

    window.scrollTo(0, 0);
    if (jwt) {
      getUserData(jwt);
    }
  }, []);

  if (isLoading) {
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="main"
    >
      <div display="flex" justifyContent="center">
        <div class="loader"></div>
      </div>
    </main>;
  } else {
    return (
      <FocusContext.Provider value={focusKey}>
        <main ref={ref} className="profile">
          <h1 className="u700">حساب کاربری</h1>
          <div className="prifile-detail">
            <div className="user"></div>
            <div className="user">
              <p className="u500">آدرس ایمیل :</p>
              <span className="user-data u500">
                {UserData?.data?.attributes.profile_info.email}
              </span>
            </div>
          </div>
          <div className="subscription">
            <div className="subscription-text">
              <h4 className="u700">وضعیت اشتراک</h4>
              <div className="subscription-status">
                <img src={UserData?.data?.attributes.profile_state_info.pic} />
                <p className="u500">
                  {UserData?.data?.attributes.profile_state_info.descr}
                </p>
              </div>
              {/* <SignOutBtn /> */}
            </div>

            <div className="subscription-notif u500">
              {UserData?.data?.attributes.profile_state_info.pay_desc}
            </div>
          </div>
          <SignOutBtn jwt={jwt} />
        </main>
      </FocusContext.Provider>
    );
  }
}

export default Profile;
