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
import { useAuth } from "../AuthProvider";
import { useOnlineStatus } from "../App";
import { Link, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";

const MenuItems = ({ isLogin }) => {
  const { jwt, setJwt } = useAuth();
  const { isOnline, isKid } = useOnlineStatus();
  const { ref, focused, focusKey } = useFocusable({
    onEnterPress: () => {},
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "right", "left"],
  });
  const myref = useRef(null);
  const [userData, setUserData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const navigate = useNavigate();
  // let jwt = localStorage.getItem("jwt");
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
    if (localStorage.getItem("MenuData")) {
      setMenuData(JSON.parse(localStorage.getItem("MenuData")));
    }
  }, []);
  useEffect(() => {
    // jwt = localStorage.getItem("jwt");
    getUserData(jwt);
    // setTimeout(() => {
    //   if (!localStorage.getItem("MenuData")) {
    //     getMenuData();
    //   }
    // }, 1000);
  }, [isLogin]);
  useEffect(() => {
    getUserData(jwt);
    setTimeout(() => {
      getMenuData();
    }, 1000);
  }, [jwt]);

  //recive menu data and check if log in
  const getMenuData = async () => {
    try {
      const userAgent = {
        os: "WebOs",
        an: "Filimo",
        vn: "1.00",
      };
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/menu/menu/sidepanel?devicetype=react_tizen`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            UserAgent: JSON.stringify(userAgent),
          },
        }
      );
      const blocks = await res?.json();
      if (blocks) {
        localStorage.setItem("MenuData", JSON.stringify(blocks?.data));
        setMenuData(blocks?.data);
      }
      // jwt = blocks.data.attributes.jwt;
      // console.log(blocks);
      // dataSet = blocks.data.attributes;
    } catch (e) {
      // setError(e);
      console.log(e);
    }
  };

  //recive user data if log in
  const getUserData = async (jwt) => {
    try {
      const userAgent = {
        os: "WebOs",
        an: "Filimo",
        vn: "1.00",
      };
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/partner/TV/profile?devicetype=react_tizen`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            UserAgent: JSON.stringify(userAgent),
          },
        }
      );
      const blocks = await res?.json();

      setUserData(blocks);
    } catch (e) {
      console.log(e);
    }
  };

  const handleInterPress = (item) => {
    if (item.link_text === "کودک" && !isLogin) {
      localStorage.setItem("lastFocus", "MOVIE_1__0");
    }
    if (item.link_text === "کودک" && isLogin) {
      localStorage.setItem("lastFocus", "MOVIE_0__0");
    }
    if (item.link_text !== "کودک") {
      localStorage.setItem("lastFocus", "MOVIE_0__0");
    }
    localStorage.removeItem("lastFocusRowBeforeReload");
    localStorage.removeItem("lastFocusRowSeriesBeforeReload");
    localStorage.removeItem("lastFocusRowKidsBeforeReload");
    localStorage.removeItem("lastFocusRowMoviesBeforeReload");
    localStorage.removeItem("lastdataloadedKids");
    localStorage.removeItem("lastdataloadedMovies");
    localStorage.removeItem("lastdataloadedSeries");
    localStorage.removeItem("lastFocus");
    localStorage.removeItem("lastMovieFocus");

    if (item.link_type === "login") {
      navigate("/login");
    }
    if (item.link_type === "profile") {
      navigate("/profile");
    }
    if (item.link_type === "search") {
      navigate("/search");
    }
    if (item.link_type === "category") {
      navigate("categories");
    }
    if (item.link_key === "1") {
      navigate("/");
    }
    if (item.link_key === "movies") {
      navigate(`/movies/filter/1/movie`);
    }
    if (item.link_key === "kids") {
      let tag_id;
      let other_data = item.link_key;
      navigate(`/movies/filter/${tag_id}/${other_data}`);
    }
    if (item.link_key === "series") {
      let tag_id = 1;
      let other_data = item.link_key;
      navigate(`/movies/filter/${tag_id}/${other_data}`);
    }

    // if (item.value === "contries") {
    //   setIsContDropShow((prev) => !prev);
    // } else {
    //   item.value === "/"
    //     ? navigate("/")
    //     : item.value === "search"
    //     ? (localStorage.removeItem("searchQuery"),
    //       localStorage.removeItem("searchResult"),
    //       navigate("/search"))
    //     : item.value === "mymovies"
    //     ? navigate("/mymovies")
    //     : item.value === "profile"
    //     ? navigate("/profile")
    //     : item.value === "login"
    //     ? navigate("/login")
    //     : item.value === "cat"
    //     ? navigate("categories")
    //     : navigate(`/movies/filter/${tag_id}/${other_data}`);
    // }
    getUserData(jwt);
    // setTimeout(() => {
    //   setFocus(localStorage.getItem("lastFocus"));
    // }, 300);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="menu-items">
        {menuData &&
          menuData
            .filter(
              (item) =>
                item.attributes.link_type !== "subscribe" &&
                item.attributes.link_type !== "settings" &&
                item.attributes.link_key !== "mycontent"
            )
            .map((item, index) => (
              <div key={item.id}>
                <SidebarItem
                  data={item.attributes}
                  handleEnterPress={(focusKey) => {
                    if (item.attributes.link_type === "list") {
                      localStorage.setItem("lastFocusMenuItem", focusKey);
                    }
                    handleInterPress(item.attributes);
                  }}
                  focuskeey={`menuItem__${index}`}
                />
              </div>
            ))}
      </div>
    </FocusContext.Provider>
  );
};

export default MenuItems;
