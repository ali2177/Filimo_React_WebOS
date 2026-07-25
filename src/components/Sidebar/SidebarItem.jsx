import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useLocation } from "react-router-dom";
import { uiStorage } from "@src/utils/uiStorage";

const SidebarItem = ({ data, handleEnterPress, focuskeey, menuData, isActive }) => {
  const { pathname } = useLocation();
  const { ref, focused, focusKey } = useFocusable({
    focusKey: focuskeey,
    onEnterPress: () => {
      handleEnterPress(focusKey);
    },
    onArrowPress: (e) => {
      if (e === "left") {
        setTimeout(() => {
          if (uiStorage.getItem("lastMovieFocus"))
            setFocus(uiStorage.getItem("lastMovieFocus"));
        }, 100);
      }
    },
  });

  // When navigating to home, focus the home sidebar item and record it
  useEffect(() => {
    if (pathname === "/" && data.link_key === "1") {
      if (menuData) {
        uiStorage.setItem(
          "lastFocusMenuItem",
          `menuItem__${menuData
            .filter(
              (item) =>
                item.attributes.link_type !== "subscribe" &&
                item.attributes.link_type !== "settings" &&
                item.attributes.link_key !== "mycontent",
            )
            .findIndex((item) => item.attributes.link_key === "1")}`,
        );
      }
    }
  }, [pathname, menuData]);

  return (
    <div className="button-sign">
      <div className={"links"}>
        <div
          ref={ref}
          style={{
            color: focused || isActive ? "white" : "gray",
            transform: focused || isActive ? "scale(1.1)" : "scale(1)",
          }}
          onMouseEnter={() => {
            setFocus(focusKey);
          }}
          onClick={() => {
            handleEnterPress(focusKey);
          }}
          className="menuItem"
        >
          <span className="sidbar-icon-wrap">
            <img
              className="sidbar-items-img"
              style={{
                width: "40px",
                height: "40px",
              }}
              src={focused || isActive ? data.link_icon_h : data.link_icon}
            />
            {isActive && <span className="menu-active-dot" />}
          </span>
          {data.link_type === "profile" && (
            <span className="menu-item-label u700">
              {data.link_text.length > 10
                ? `...${data.link_text.slice(0, 10)}`
                : data.link_text}
            </span>
          )}
          {data.link_type !== "profile" && (
            <span className="menu-item-label u700">{data.link_text}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SidebarItem);
