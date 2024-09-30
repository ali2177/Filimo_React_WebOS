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
import UserManegBtn from "./UserManegBtn";

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="33"
                  viewBox="0 0 32 33"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.59239 5.41374C10.785 3.94865 13.3629 3.16666 16 3.16666C17.751 3.16666 19.4848 3.51154 21.1024 4.1816C22.7201 4.85167 24.19 5.83379 25.4281 7.07191C26.6662 8.31002 27.6483 9.77988 28.3184 11.3976C28.9885 13.0152 29.3333 14.749 29.3333 16.5C29.3333 19.1371 28.5513 21.7149 27.0863 23.9076C25.6212 26.1003 23.5388 27.8092 21.1024 28.8184C18.6661 29.8276 15.9852 30.0916 13.3988 29.5771C10.8124 29.0627 8.43661 27.7928 6.57191 25.9281C4.70721 24.0634 3.43733 21.6876 2.92286 19.1012C2.40839 16.5148 2.67243 13.8339 3.6816 11.3976C4.69077 8.9612 6.39974 6.87882 8.59239 5.41374ZM10.0739 25.369C11.828 26.5411 13.8903 27.1667 16 27.1667C18.829 27.1667 21.5421 26.0429 23.5425 24.0425C25.5429 22.0421 26.6667 19.329 26.6667 16.5C26.6667 14.3903 26.0411 12.328 24.869 10.5739C23.6969 8.81979 22.031 7.45262 20.082 6.64528C18.1329 5.83795 15.9882 5.62671 13.919 6.03829C11.8499 6.44986 9.94928 7.46576 8.45752 8.95753C6.96576 10.4493 5.94986 12.3499 5.53829 14.419C5.12671 16.4882 5.33795 18.6329 6.14528 20.582C6.95262 22.531 8.31979 24.1969 10.0739 25.369ZM23.1794 11.5947C23.3419 11.6624 23.4894 11.7616 23.6133 11.8866C23.7465 12.0113 23.8527 12.162 23.9253 12.3295C23.9979 12.4969 24.0354 12.6774 24.0354 12.8599C24.0354 13.0424 23.9979 13.2229 23.9253 13.3904C23.8527 13.5578 23.7465 13.7085 23.6133 13.8332L14.9467 22.4999C14.8227 22.6249 14.6752 22.7241 14.5128 22.7918C14.3503 22.8595 14.176 22.8943 14 22.8943C13.824 22.8943 13.6497 22.8595 13.4872 22.7918C13.3247 22.7241 13.1773 22.6249 13.0533 22.4999L8.38666 17.8332C8.12852 17.5822 7.98069 17.2388 7.97569 16.8788C7.97069 16.5187 8.10893 16.1714 8.36 15.9132C8.61107 15.6551 8.95441 15.5073 9.31448 15.5023C9.49276 15.4998 9.66979 15.5325 9.83546 15.5984C10.0011 15.6643 10.1522 15.7623 10.28 15.8866L14 19.6199L21.72 11.8866C21.844 11.7616 21.9914 11.6624 22.1539 11.5947C22.3164 11.527 22.4907 11.4922 22.6667 11.4922C22.8427 11.4922 23.017 11.527 23.1794 11.5947Z"
                    fill="#22BC67"
                  />
                </svg>
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
          <div className="subscription">
            <div className="subscription-text">
              <div className="subscription-status">
                <div className="profile-pic-wrraper">
                  <img
                    className="profile-pic-image"
                    src={UserData?.data?.attributes.profile_icon_info}
                  />
                </div>
                <div className="user-info">
                  <p className="u500">
                    {UserData?.data?.attributes.profile_info.name}
                  </p>
                  <div className="user-info-id">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.39 1.58L19.89 4.75C20.0707 4.82655 20.225 4.95461 20.3334 5.1182C20.4419 5.2818 20.4998 5.47371 20.5 5.67V12C20.5 16.59 17.33 20.68 12.33 22.44C12.1172 22.5198 11.8828 22.5198 11.67 22.44C6.71 20.68 3.5 16.59 3.5 12V5.67C3.50016 5.47371 3.55809 5.2818 3.66656 5.1182C3.77503 4.95461 3.92925 4.82655 4.11 4.75L11.61 1.58C11.8604 1.47984 12.1396 1.47984 12.39 1.58ZM12 20.44C15.96 18.9 18.5 15.63 18.5 12V6.33L12 3.59L5.5 6.33V12C5.5 15.63 8 18.9 12 20.44ZM8.48939 11.2603C8.75851 11.2575 9.01772 11.3617 9.21 11.55L11 13.34L14.79 9.58999C14.977 9.40169 15.2311 9.29537 15.4965 9.29444C15.7618 9.2935 16.0167 9.39801 16.205 9.58499C16.3933 9.77197 16.4996 10.0261 16.5006 10.2915C16.5015 10.5568 16.397 10.8117 16.21 11L11.71 15.5C11.617 15.5937 11.5064 15.6681 11.3846 15.7189C11.2627 15.7697 11.132 15.7958 11 15.7958C10.868 15.7958 10.7373 15.7697 10.6154 15.7189C10.4936 15.6681 10.383 15.5937 10.29 15.5L7.79 13C7.59772 12.8117 7.48811 12.5547 7.4853 12.2856C7.48249 12.0165 7.58669 11.7573 7.775 11.565C7.9633 11.3727 8.22028 11.2631 8.48939 11.2603Z"
                        fill="white"
                        fill-opacity="0.9"
                      />
                    </svg>
                    <p className="u500">شماره کاربری :</p>
                    <p className="u500">
                      {UserData?.data?.attributes.profile_info.id}
                    </p>
                  </div>
                </div>
              </div>
              {/* <SignOutBtn /> */}
            </div>

            <UserManegBtn />
          </div>
          <SignOutBtn jwt={jwt} />
        </main>
      </FocusContext.Provider>
    );
  }
}

export default Profile;
