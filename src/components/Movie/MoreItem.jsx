import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { uiStorage } from "@src/utils/uiStorage";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { centerHorizontally, scrollVertically } from "@src/utils/scrollHelpers";

function MoreItem({
  tag_id,
  onFocus,
  onEnterPress,
  movieFocus,
  focusKeey,
  type,
  movies,
  linkText,
  onscroll,
  isLandscape,
}) {
  const handleAction = () => {
    if (type === "mainPage") {
      uiStorage.setItem("lastFocus", focusKeey);
      uiStorage.setItem("level", "level__1");
      navigate(`/moremovies/${tag_id}`);
    } else if (type === "moreReccom") {
      uiStorage.setItem("moreSingle", JSON.stringify(movies));
      navigate(`/moreSingle/${linkText}`);
    } else if (type === "live") {
      uiStorage.setItem("lastFocus", focusKeey);
      uiStorage.setItem("moreSingle", JSON.stringify(movies));
      navigate(`/moreMovieSingle`);
    } else if (type === "moreCat") {
      uiStorage.setItem("lastFocusCat", focusKeey);
      uiStorage.setItem("moreSingle", JSON.stringify(movies));
      navigate(`/moreMovieSingle`);
    } else if (type === "morePage") {
      if (uiStorage.getItem("level") === "level__1") {
        uiStorage.setItem("lastFocusMore_level__1", focusKeey);
        uiStorage.removeItem("lastFocusMoreMovie_level__1");
      } else if (uiStorage.getItem("level") === "level__2") {
        uiStorage.setItem("lastFocusMore_level__2", focusKeey);
        uiStorage.removeItem("lastFocusMoreMovie_level__2");
      } else {
        uiStorage.setItem("lastFocusMore", focusKeey);
      }
      if (uiStorage.getItem("level")) {
        uiStorage.setItem(
          "level",
          `level__${Number(uiStorage.getItem("level").slice(7, 8)) + 1}`,
        );
      }

      navigate(`/moremovies/${tag_id}`);
    } else {
      uiStorage.setItem("lastFocusMore", focusKeey);
      uiStorage.setItem("moreSingle", JSON.stringify(movies));
      navigate(`/moreMovieSingle/`);
    }
  };
  const { ref, focused, focusKey } = useFocusable({
    onFocus: () => {
      // onscroll();
      handleScrolling();
      onMovieFocus();
    },
    onEnterPress: () => {
      handleAction();
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focusKeey,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const myRef = useRef();
  const handleScrolling = () => {
    setTimeout(() => {
      if (uiStorage.getItem("mode") === "KeyboardMode") {
        centerHorizontally(myRef.current);
        scrollVertically(
          myRef.current,
          focusKey.slice(5, 6) === "0" ? "end" : "center",
        );
      }
    }, 10);
  };
  const onMovieFocus = () => {
    if (location.pathname !== "/") return;
    movieFocus(null);
  };

  // Match the row's card orientation so the "more" button lines up with the
  // items. Landscape rows are thumbplay-theme or live TV (same rule as Movie).
  const firstMovie = Array.isArray(movies) ? movies[0] : undefined;
  const landscape =
    isLandscape ??
    (firstMovie?.theme === "thumbplay" || firstMovie?.type === "livetvs");

  return (
    <div
      className={focused ? "btn-not-focus btn-focus" : "btn-not-focus"}
      ref={ref}
      style={landscape ? { width: "20.5rem", height: "auto" } : undefined}
    >
      <img
        ref={myRef}
        className={landscape ? "more-item more-item-landscape" : "more-item"}
        src={process.env.PUBLIC_URL + "/icon_more.png"}
        onClick={handleAction}
        onMouseEnter={() => {
          setFocus(focusKey);
        }}
        // alt={movie.movie_title_en}
      />
      <span className="movie-title u500">مشاهده بیشتر</span>
    </div>
  );
}

export default React.memo(MoreItem);
