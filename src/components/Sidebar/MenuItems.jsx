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

// Brand mark for the collapsed rail. Signed in, the profile block takes this
// slot instead; signed in or out, the design hides it once the panel expands.
const FILIMO_MARK =
  "https://www.filimo.com/assets/app/filimo/android/nlogo_tv/ic_launcher_v2.webp";

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
  const { data: menuResponse } = useGetMenuQuery(jwt, {
    refetchOnMountOrArgChange: true,
  });

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
      case "subscribe":
        // TODO: no purchase screen exists yet. The row is rendered because the
        // design calls for it; wire this up once the route lands.
        return;
      default:
        // Backend added a link_type this build doesn't route yet — no-op rather
        // than break navigation. Surface it so we know to add a case.
        console.warn("[MenuItems] unhandled link_type:", link_type, item);
        return;
    }
  };

  // Three slots, mirroring the API's own `position` field: the profile item goes
  // in the head block above the list ("top-right"), settings is pinned to the
  // bottom ("bottom-right"), everything else is a list row ("right"). Signed
  // out there is no profile item — the API sends a "login" row instead, which
  // stays inline, and the head block shows the brand mark.
  const filteredMenu = menuData
    ? menuData.filter(
        (item) =>
          item.attributes.link_type !== "profile" &&
          item.attributes.link_type !== "settings",
      )
    : [];

  const profileItem = menuData
    ? menuData.find((item) => item.attributes.link_type === "profile")
    : null;

  const settingsItem = menuData
    ? menuData.find((item) => item.attributes.link_type === "settings")
    : null;

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="menu-items">
        <div className="nav-top">
          {/* Both head nodes are rendered whenever a profile exists; Sidebar.css
              shows the brand mark on the collapsed rail and the profile block on
              the expanded panel. Signed out there is no profile item, so the mark
              stays in both states — which is what Figma 2028:6158 shows. */}
          <div className="nav-head">
            <img className="nav-logo" src={FILIMO_MARK} alt="" />
            {profileItem && (
              <SidebarItem
                data={profileItem.attributes}
                variant="profile"
                handleEnterPress={(fk) => {
                  uiStorage.setItem("lastFocusMenuItem", fk);
                  handleInterPress(profileItem.attributes);
                }}
                focuskeey="menuItem__profile"
                isActive={getIsActive(profileItem)}
              />
            )}
          </div>

          <div className="menu-items-list">
            {filteredMenu.map((item, index) => (
              <SidebarItem
                key={`${item.id}-${index}`}
                data={item.attributes}
                handleEnterPress={(fk) => {
                  uiStorage.setItem("lastFocusMenuItem", fk);
                  handleInterPress(item.attributes);
                }}
                focuskeey={`menuItem__${index}`}
                isActive={getIsActive(item)}
              />
            ))}
          </div>
        </div>

        {/* {settingsItem && (
          <div className="menu-settings-item">
            <SidebarItem
              data={settingsItem.attributes}
              handleEnterPress={(fk) => {
                uiStorage.setItem("lastFocusMenuItem", fk);
                handleInterPress(settingsItem.attributes);
              }}
              focuskeey="menuItem__settings"
              isActive={getIsActive(settingsItem)}
            />
          </div>
        )} */}
      </div>
    </FocusContext.Provider>
  );
};

export default MenuItems;
