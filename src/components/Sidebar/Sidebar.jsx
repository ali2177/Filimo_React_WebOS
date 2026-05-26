import React, { useEffect, useState, useRef } from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import "./Sidebar.css";
import logo from "../../assets/images/televika_type.png";
import televikaX from "../../assets/images/televika_sign.png";
import MenuItems from "./MenuItems";

const Sidebar = React.memo(({ focusd, isLogin }) => {
  const { ref, focused, focusSelf } = useFocusable();
  return (
    <>
      <div ref={ref} className="logo-element">
        {focusd ? (
          <img
            style={{
              transform: focused ? "scale(1.3)" : "scale(1)",
            }}
            src="https://www.filimo.com/assets/app/filimo/android/nlogo_tv/ic_filimo_banner_v3.webp"
            className="logo-expended"
          />
        ) : (
          <img
            style={{
              transform: focused ? "scale(1.3)" : "scale(1)",
            }}
            src="https://www.filimo.com/assets/app/filimo/android/nlogo_tv/ic_launcher_v2.webp"
            className="logo"
          />
        )}
      </div>
      <MenuItems isLogin={isLogin} />
    </>
  );
});
export default Sidebar;
