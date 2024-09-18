import React from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import {
  genreIcons,
  categoriiesIfNotSignIn,
  categoriiesIfSignIn,
} from "../../utils";
import { Link, useNavigate } from "react-router-dom";

const SidebarItem = ({
  label,
  icon,
  userData,
  type,
  value,
  onFocus,
  onEnterPress,
}) => {
  const { ref, focused } = useFocusable({
    onFocus,
    onEnterPress,
    onArrowPress: (e) => {
      if (e === "left") {
        setTimeout(() => {
          setFocus(localStorage.getItem("lastMovieFocus"));
        }, 1);
      }
    },
  });

  return (
    <div
      className={type === "sign-in" ? "button-sign" : "button-notsign"}
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
      <Link className={"links"} to="/">
        <div
          ref={ref}
          style={{
            color: focused ? "white" : "gray",
            transform: focused ? "scale(1.1)" : "scale(1)",
          }}
          className="menuItem"
        >
          <img
            style={{
              width: "40px",
              height: "40px",
            }}
            src={genreIcons[icon.toLowerCase()]}
          />
          <h8 className="menu-item-label u700">
            {value === "profile"
              ? userData?.data?.attributes.profile_info.username
              : label}
          </h8>
        </div>
      </Link>
    </div>
  );
};

export default SidebarItem;
