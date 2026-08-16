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

// The API ships several primary destinations (home, kids, movies, series) with
// link_type "list". Those have dedicated routing keyed off link_key, so the
// generic "list" fallback must skip them and only handle genuinely new lists.
const HANDLED_LIST_KEYS = ["1", "kids", "movies", "series"];

// A list link_key may embed a filter/sort as "{tag}__FILTER__{filter&sort}",
// which maps to tagid/{tag}/other_data/{filter&sort} (per the API link_type guide).
const LIST_FILTER_SEP = "__FILTER__";

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

  // TEMP: the menu API doesn't yet return the "My Movies" (mycontent) item —
  // backend needs to add it. Hardcode it here so the page is testable. Remove
  // this block once the API ships the item. Only shown when logged in (the
  // list lives behind /bookmark, which needs auth).
  const MYCONTENT_ITEM = {
    type: "Menu",
    id: "mycontent",
    attributes: {
      link_text: "فیلم‌های من",
      link_type: "mycontent",
      link_key: "mycontent",
      link_icon:
        "https://www.filimo.com/assets/web/ui/img-bbLjsNZpUIPFNoOx9r2Klg/api/menu/newandroidtv/100/Grey/Bookmark.png",
      link_icon_h:
        "https://www.filimo.com/assets/web/ui/img-bbLjsNZpUIPFNoOx9r2Klg/api/menu/newandroidtv/100/White/Bookmark.png",
      position: "right",
      id: "mycontent",
    },
  };

  const rawMenuData = menuResponse?.data;
  const menuData =
    rawMenuData &&
    isLogin &&
    !rawMenuData.some((item) => item.attributes.link_key === "mycontent")
      ? [...rawMenuData, MYCONTENT_ITEM]
      : rawMenuData;

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
    if (link_type === "settings") return pathname === "/settings";
    if (link_key === "mycontent") return pathname === "/mymovies";
    // Generic backend-driven list item (home/kids/movies/series are "list" too
    // but handled by link_key above). Mirror navigateForItem's target so the
    // highlight tracks both filtered (__FILTER__) and plain-tag lists.
    if (link_type === "list" && !HANDLED_LIST_KEYS.includes(link_key)) {
      const key = link_key || "";
      if (key.includes(LIST_FILTER_SEP)) {
        const [tag, filterAndSort] = key.split(LIST_FILTER_SEP);
        return pathname === `/movies/filter/${tag}/${filterAndSort}`;
      }
      return pathname === `/moremovies/${key}`;
    }
    return false;
  };

  const handleInterPress = (item) => {
    // Gate on the stable link_key, not the localized link_text (which changes
    // to English once the API locale flips).
    if (item.link_key === "kids" && !isLogin) {
      uiStorage.setItem("lastFocus", "MOVIE_1__0");
    }
    if (item.link_key === "kids" && isLogin) {
      uiStorage.setItem("lastFocus", "MOVIE_0__0");
    }
    if (item.link_key !== "kids") {
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

    navigateForItem(item);
  };

  // Resolve a menu item to a navigation action, following the API's
  // link_type/link_key contract. Exactly one branch runs (each returns), so a
  // single item can't trigger two navigations — the fall-through if-chain this
  // replaced let home (link_key "1" + link_type "list") match twice and land on
  // the wrong page. Unknown link_types intentionally no-op (a harmless dead
  // button) instead of breaking navigation, so backend-added types are safe.
  const navigateForItem = (item) => {
    const { link_type, link_key } = item;

    // Primary destinations the API ships as link_type "list" with well-known
    // keys — each has a bespoke route, so match them before the generic list.
    switch (link_key) {
      case "1":
        return navigate("/");
      case "movies":
        return navigate("/movies/filter/1/movie");
      case "series":
        return navigate("/movies/filter/1/series");
      case "kids":
        // tag_id is unused for kids (Home keys off the "/kids" suffix and
        // getMovies off other_data === "kids"); 1 is just a placeholder.
        return navigate("/movies/filter/1/kids");
      case "mycontent":
        return navigate("/mymovies");
      default:
        break;
    }

    switch (link_type) {
      case "list": {
        // link_key is either a plain tag id, or "{tag}__FILTER__{filter&sort}"
        // (per the API guide) which maps to tagid/{tag}/other_data/{filter&sort}.
        const key = link_key || "";
        if (key.includes(LIST_FILTER_SEP)) {
          const [tag, filterAndSort] = key.split(LIST_FILTER_SEP);
          return navigate(`/movies/filter/${tag}/${filterAndSort}`);
        }
        return navigate(`/moremovies/${key}`);
      }
      case "category":
        return navigate("/categories");
      case "profile":
        return navigate("/profile");
      case "login":
        return navigate("/login");
      case "search":
        return navigate("/search");
      case "settings":
        return navigate("/settings");
      case "movie":
        return navigate(`/movie/${link_key}`);
      case "crew":
        return navigate(`/actor/${link_key}`);
      case "web":
      case "web-inapp":
        if (link_key) window.open(link_key, "_blank", "noopener");
        return;
      case "nolink":
        return; // explicitly do nothing
      default:
        // Backend added a link_type this build doesn't route yet — no-op rather
        // than break navigation. Surface it so we know to add a case.
        console.warn("[MenuItems] unhandled link_type:", link_type, item);
        return;
    }
  };

  const filteredMenu = menuData
    ? menuData.filter(
        (item) =>
          item.attributes.link_type !== "subscribe" &&
          item.attributes.link_type !== "settings"
      )
    : [];

  // The API ships a settings item (link_type "settings", position "bottom-right")
  // that we render pinned to the bottom of the sidebar rather than inline.
  const settingsItem = menuData
    ? menuData.find((item) => item.attributes.link_type === "settings")
    : null;

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

        {settingsItem && (
          <div className="menu-settings-item">
            <SidebarItem
              data={settingsItem.attributes}
              handleEnterPress={(fk) => {
                uiStorage.setItem("lastFocusMenuItem", fk);
                handleInterPress(settingsItem.attributes);
              }}
              focuskeey="menuItem__settings"
              menuData={menuData}
              isActive={getIsActive(settingsItem)}
            />
          </div>
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default MenuItems;
