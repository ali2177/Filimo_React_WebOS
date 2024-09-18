import React, { useEffect, useRef, useState } from "react";
import {
  genreIcons,
  categoriiesIfNotSignIn,
  categoriiesIfSignIn,
} from "../../utils";
import {
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { Link, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";

const MenuItems = ({ isLogin }) => {
  const { ref, focused, focusKey } = useFocusable({
    onFocus: () => {},
    onEnterPress: () => {},
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "right", "left"],
  });
  const myref = useRef(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  let jwt = localStorage.getItem("jwt");
  const onAssetFocus = React.useCallback(
    ({ y }) => {
      if (ref)
        ref.current.scrollIntoView({
          block: "end",
        });

      // console.log(ref.current.scrollTop);
      // ref.current.scrollTop += 10;
      // console.log(ref.current.scrollTop);
      // ref.current.style.scrollBehavior = "smooth";
    },
    [ref]
  );
  useEffect(() => {
    jwt = localStorage.getItem("jwt");
    getUserData(jwt);
  }, [isLogin]);
  useEffect(() => {
    getUserData(jwt);
  }, [jwt]);

  //recive user data if log in
  const getUserData = async (jwt) => {
    try {
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/partner/TV/profile`,
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

  const handleInterPress = (value, tag_id, other_data) => {
    localStorage.setItem("lastFocus", "MOVIE_0__0");
    localStorage.removeItem("lastFocusRowBeforeReload");
    localStorage.removeItem("lastFocusRowSeriesBeforeReload");

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
    setTimeout(() => {
      setFocus(localStorage.getItem("lastFocus"));
    }, 300);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="menu-items">
        {isLogin
          ? categoriiesIfSignIn.map(
              ({ label, value, icon, tag_id, other_data, list }) => (
                <>
                  <div ref={ref}>
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
                  <div ref={ref}>
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
    </FocusContext.Provider>
  );
};

export default MenuItems;
