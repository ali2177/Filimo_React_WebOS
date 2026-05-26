import React, { useEffect, useState } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { Routes, Route, useLocation, useNavigation } from "react-router-dom";
import {
  genreIcons,
  categoriiesIfNotSignIn,
  categoriiesIfSignIn,
} from "../../utils";
import { Link, useNavigate } from "react-router-dom";

const SidebarItem = ({ data, handleEnterPress, focuskeey }) => {
  const { pathname } = useLocation();
  const [isActive, setIsActive] = useState(false);
  const { ref, focused, focusKey } = useFocusable({
    focusKey: focuskeey,
    onEnterPress: () => {
      handleEnterPress(focusKey);
    },
    onArrowPress: (e) => {
      if (e === "left") {
        // setFocus(localStorage.getItem("lastMovieFocus"));
        setTimeout(() => {
          // console.log(localStorage.getItem("lastMovieFocus"));
          if (localStorage.getItem("lastMovieFocus"))
            setFocus(localStorage.getItem("lastMovieFocus"));
        }, 100);
      }
    },
  });

  useEffect(() => {
    if (localStorage.getItem("lastFocusMenuItem") === focuskeey) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [localStorage.getItem("lastFocusMenuItem")]);
  useEffect(() => {
    // console.log(
    //   JSON.parse(localStorage.getItem("MenuData")).findIndex(
    //     (item) => item.attributes.link_key === "1"
    //   )
    // );
    if (pathname === "/") {
      if (localStorage.getItem("MenuData")) {
        localStorage.setItem(
          "lastFocusMenuItem",
          `menuItem__${JSON.parse(localStorage.getItem("MenuData"))
            .filter(
              (item) =>
                item.attributes.link_type !== "subscribe" &&
                item.attributes.link_type !== "settings" &&
                item.attributes.link_type !== "mycontent"
            )
            .findIndex((item) => item.attributes.link_key === "1")}`
        );
      }
    }
  }, [pathname]);

  return (
    <div
      className="button-sign"
      // onEnterPress={() => {
      //   if (value === "contries") {
      //     setIsContDropShow((prev) => !prev);
      //   } else {
      //     value === "/"
      //       ? navigate("/")
      //       : value === "search"
      //       ? navigate("/search")
      //       : value === "mymovies"
      //       ? navigate("/mymovies")
      //       : value === "profile"
      //       ? navigate("/profile")
      //       : value === "login"
      //       ? navigate("/login")
      //       : value === "cat"
      //       ? navigate("categories")
      //       : navigate(`/movies/filter/${tag_id}/${other_data}`);
      //   }
      //   getUserData(jwt);
      // }}
    >
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
          <img
            className="sidbar-items-img"
            style={{
              width: "40px",
              height: "40px",
            }}
            src={focused || isActive ? data.link_icon_h : data.link_icon}
          />
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

export default SidebarItem;
