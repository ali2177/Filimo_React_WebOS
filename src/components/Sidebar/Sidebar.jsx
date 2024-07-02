import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import {
  genreIcons,
  categoriiesIfNotSignIn,
  categoriiesIfSignIn,
} from "../../utils";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import "./Sidebar.css";
import logo from "../../assets/images/televika_type.png";
import televikaX from "../../assets/images/televika_sign.png";
import SidebarItem from "./SidebarItem";

function Sidebar({ focusd, isLogin }) {
  const { ref, focused } = useFocusable();
  const myref = useRef(null);
  const [userData, setUserData] = useState(null);
  const [isContDropShow, setIsContDropShow] = useState(false);
  const navigate = useNavigate();
  let jwt = localStorage.getItem("jwt");

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
    } catch (e) {
      console.log(e);
    }
  };

  const onAssetFocus = React.useCallback(
    ({ y }) => {
      if (myref)
        myref.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });

      // console.log(ref.current.scrollTop);
      // ref.current.scrollTop += 10;
      // console.log(ref.current.scrollTop);
      // ref.current.style.scrollBehavior = "smooth";
    },
    [ref]
  );
  const handleInterPress = (value, tag_id, other_data) => {
    localStorage.removeItem("lastFocus");

    if (value === "contries") {
      setIsContDropShow((prev) => !prev);
    } else {
      value === "/"
        ? navigate("/")
        : value === "search"
        ? (localStorage.removeItem("searchQuery"),
          localStorage.removeItem("searchResult"),
          navigate("/search"))
        : value === "mymovies"
        ? navigate("/mymovies")
        : value === "profile"
        ? navigate("/profile")
        : value === "login"
        ? navigate("/login")
        : value === "cat"
        ? navigate("categories")
        : navigate(`/movies/filter/${tag_id}/${other_data}`);
    }
    getUserData(jwt);
  };

  useEffect(() => {
    jwt = localStorage.getItem("jwt");
    getUserData(jwt);
  }, [isLogin]);

  return (
    <>
      <div className="logo-element">
        {focusd ? (
          <img
            ref={ref}
            style={{
              transform: focused ? "scale(1.3)" : "scale(1)",
            }}
            src={logo}
            className="logo-expended"
          />
        ) : (
          <img
            ref={ref}
            style={{
              transform: focused ? "scale(1.3)" : "scale(1)",
            }}
            src={televikaX}
            className="logo"
          />
        )}
      </div>

      <div className="menu-items">
        {isLogin
          ? categoriiesIfSignIn.map(
              ({ label, value, icon, tag_id, other_data, list }) => (
                <>
                  <div ref={myref}>
                    <SidebarItem
                      label={label}
                      icon={icon}
                      userData={userData}
                      type="sign-in"
                      value={value}
                      onFocus={onAssetFocus}
                      onEnterPress={() =>
                        handleInterPress(value, tag_id, other_data)
                      }
                    />
                  </div>
                  {/* <Focusable
                    className={"button-sign"}
                    onClickEnter={() => {
                      if (value === "contries") {
                        setIsContDropShow((prev) => !prev);
                      } else {
                        value === "/"
                          ? navigate("/")
                          : value === "search"
                          ? (navigate("/search"),
                            localStorage.removeItem("searchResult"),
                            localStorage.removeItem("searchQuery"))
                          : value === "mymovies"
                          ? navigate("/mymovies")
                          : value === "profile"
                          ? navigate("/profile")
                          : value === "login"
                          ? navigate("/login")
                          : value === "cat"
                          ? navigate("categories")
                          : navigate(`/movies/filter/${tag_id}/${other_data}`);
                      }
                      getUserData(jwt);
                    }}
                  >
                    <Link className={"links"} to="/">
                      <div className="menuItem">
                        <img
                          style={{ width: "40px" }}
                          src={genreIcons[icon.toLowerCase()]}
                        />
                        <h8 className="menu-item-label u700">
                          {label === "حساب کاربری"
                            ? userData?.data?.attributes.profile_info.username
                            : label}
                        </h8>
                      </div>
                    </Link>
                  </Focusable> */}

                  {/* {isContDropShow &&
                    list &&
                    list.map(({ contName, contValue }) => (
                      <Focusable
                        className={"button"}
                        onClickEnter={() => {
                          navigate(`/movies/filter/1/${contValue}`);
                        }}
                      >
                        <Link className={"links"} to="/">
                          <div className="menuItem">
                            <h1 className="menu-item-label u700">{contName}</h1>
                          </div>
                        </Link>
                      </Focusable>
                    ))} */}
                </>
              )
            )
          : categoriiesIfNotSignIn.map(
              ({ label, value, icon, tag_id, other_data, list }) => (
                <>
                  <div ref={myref}>
                    <SidebarItem
                      label={label}
                      icon={icon}
                      userData={userData}
                      type="not-sign-in"
                      value={value}
                      onFocus={onAssetFocus}
                      onEnterPress={() =>
                        handleInterPress(value, tag_id, other_data)
                      }
                    />
                  </div>
                  {/* <Focusable
                    className={"button-notsign"}
                    onClickEnter={() => {
                      if (value === "contries") {
                        setIsContDropShow((prev) => !prev);
                      } else {
                        value === "/"
                          ? navigate("/")
                          : value === "search"
                          ? (navigate("/search"),
                            localStorage.removeItem("searchResult"),
                            localStorage.removeItem("searchQuery"))
                          : value === "login"
                          ? navigate("/login")
                          : value === "cat"
                          ? navigate("categories")
                          : navigate(`/movies/filter/${tag_id}/${other_data}`);
                      }
                    }}
                  >
                    <Link className={"links"} to="/">
                      <div className="menuItem">
                        <img src={genreIcons[icon.toLowerCase()]} />
                        <h1 className="menu-item-label u700">{label}</h1>
                      </div>
                    </Link>
                  </Focusable> */}
                  {/* {isContDropShow &&
                    list &&
                    list.map(({ contName, contValue }) => (
                      <Focusable
                        className={"button"}
                        onClickEnter={() => {
                          navigate(`/movies/filter/${tag_id}/${contValue}`);
                        }}
                      >
                        <Link className={"links"} to="/">
                          <div className="menuItem">
                            <h1 className="menu-item-label u700">{contName}</h1>
                          </div>
                        </Link>
                      </Focusable>
                    ))} */}
                </>
              )
            )}
      </div>
    </>
  );
}
export default Sidebar;
