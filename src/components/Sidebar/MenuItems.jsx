import React from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { useAuth } from "../AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import { uiStorage } from "@src/utils/uiStorage";
import { useGetMenuQuery } from "../../services/TMDB";

const MenuItems = ({ isLogin }) => {
  const { jwt } = useAuth();
  const { ref, focusKey } = useFocusable({
    onEnterPress: () => {},
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up"],
  });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: menuResponse } = useGetMenuQuery(jwt, { refetchOnMountOrArgChange: true });
  const menuData = menuResponse?.data;

  const getIsActive = (item) => {
    const { link_key, link_type } = item.attributes;
    if (link_key === "1") return pathname === "/";
    if (link_key === "movies") return pathname === "/movies/filter/1/movie";
    if (link_key === "series") return pathname === "/movies/filter/1/series";
    if (link_key === "kids") return pathname.endsWith("/kids");
    if (link_type === "search") return pathname === "/search";
    if (link_type === "profile") return pathname === "/profile";
    if (link_type === "login") return pathname === "/login";
    if (link_type === "category") return pathname === "/categories";
    return false;
  };

  const handleInterPress = (item) => {
    if (item.link_text === "کودک" && !isLogin) {
      uiStorage.setItem("lastFocus", "MOVIE_1__0");
    }
    if (item.link_text === "کودک" && isLogin) {
      uiStorage.setItem("lastFocus", "MOVIE_0__0");
    }
    if (item.link_text !== "کودک") {
      uiStorage.setItem("lastFocus", "MOVIE_0__0");
    }
    uiStorage.removeItem("lastFocusRowBeforeReload");
    uiStorage.removeItem("lastFocusRowSeriesBeforeReload");
    uiStorage.removeItem("lastFocusRowKidsBeforeReload");
    uiStorage.removeItem("lastFocusRowMoviesBeforeReload");
    uiStorage.removeItem("lastdataloadedKids");
    uiStorage.removeItem("lastdataloadedMovies");
    uiStorage.removeItem("lastdataloadedSeries");
    uiStorage.removeItem("lastFocus");
    uiStorage.removeItem("lastMovieFocus");

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
  };

  const filteredMenu = menuData
    ? menuData.filter(
        (item) =>
          item.attributes.link_type !== "subscribe" &&
          item.attributes.link_type !== "settings" &&
          item.attributes.link_key !== "mycontent"
      )
    : [];

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="menu-items">
        {filteredMenu.map((item, index) => (
          <div key={`${item.id}-${index}`}>
            <SidebarItem
              data={item.attributes}
              handleEnterPress={(fk) => {
                uiStorage.setItem("lastFocusMenuItem", fk);
                handleInterPress(item.attributes);
              }}
              focuskeey={`menuItem__${index}`}
              menuData={menuData}
              isActive={getIsActive(item)}
            />
          </div>
        ))}
      </div>
    </FocusContext.Provider>
  );
};

export default MenuItems;
