import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

const UserManegBtn = () => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      // console.log("focus");
    },
    onEnterPress: () => {
      navigate("/usersProfile");
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
  return (
    <div
      ref={ref}
      className={
        focused
          ? "subscription-notif subscription-notif-focus u500"
          : "subscription-notif u500"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.72335 22.3903C3.20265 22.911 3.20265 23.7552 3.72335 24.2759L9.72335 30.2759C10.244 30.7966 11.0883 30.7966 11.609 30.2759C12.1297 29.7552 12.1297 28.911 11.609 28.3903L7.88511 24.6664L26.6667 24.6664C27.4031 24.6664 28 24.0694 28 23.3331C28 22.5967 27.4031 21.9997 26.6667 21.9997L7.88511 21.9997L11.609 18.2759C12.1297 17.7552 12.1297 16.911 11.609 16.3903C11.0883 15.8696 10.244 15.8696 9.72335 16.3903L3.72335 22.3903Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.33339 9.99992C4.59701 9.99992 4.00006 9.40297 4.00006 8.66659C4.00006 7.93021 4.59701 7.33326 5.33339 7.33326L24.115 7.33326L20.3911 3.6094C19.8704 3.0887 19.8704 2.24448 20.3911 1.72378C20.9118 1.20308 21.756 1.20308 22.2767 1.72378L28.2767 7.72378C28.7974 8.24448 28.7974 9.0887 28.2767 9.6094L22.2767 15.6094C21.756 16.1301 20.9118 16.1301 20.3911 15.6094C19.8704 15.0887 19.8704 14.2445 20.3911 13.7238L24.115 9.99992L5.33339 9.99992Z"
          fill="white"
        />
      </svg>
      مدیریت اعضا
    </div>
  );
};

export default UserManegBtn;
