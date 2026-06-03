import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

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
}) {
  const handleAction = () => {
    if (type === "mainPage") {
      localStorage.setItem("lastFocus", focusKeey);

      localStorage.setItem("level", "level__1");
      navigate(`/moremovies/${tag_id}`);
    } else if (type === "moreReccom") {
      localStorage.setItem("moreSingle", JSON.stringify(movies));
      navigate(`/moreSingle/${linkText}`);
    } else if (type === "live") {
      localStorage.setItem("lastFocus", focusKeey);
      localStorage.setItem("moreSingle", JSON.stringify(movies));
      navigate(`/moreMovieSingle`);
    } else if (type === "moreCat") {
      localStorage.setItem("lastFocusCat", focusKeey);
      localStorage.setItem("moreSingle", JSON.stringify(movies));
      navigate(`/moreMovieSingle`);
    } else if (type === "morePage") {
      if (localStorage.getItem("level") === "level__1") {
        localStorage.setItem("lastFocusMore_level__1", focusKeey);
        localStorage.removeItem("lastFocusMoreMovie_level__1");
      } else if (localStorage.getItem("level") === "level__2") {
        localStorage.setItem("lastFocusMore_level__2", focusKeey);
        localStorage.removeItem("lastFocusMoreMovie_level__2");
      } else {
        localStorage.setItem("lastFocusMore", focusKeey);
      }
      if (localStorage.getItem("level")) {
        localStorage.setItem(
          "level",
          `level__${Number(localStorage.getItem("level").slice(7, 8)) + 1}`
        );
      }

      navigate(`/moremovies/${tag_id}`);
    } else {
      localStorage.setItem("lastFocusMore", focusKeey);
      localStorage.setItem("moreSingle", JSON.stringify(movies));
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
    // console.log(focusKey);
    setTimeout(() => {
      if (localStorage.getItem("mode") === "KeyboardMode") {
        myRef?.current?.scrollIntoView({
          block: focusKey.slice(5, 6) === "0" ? "end" : "center",
        });
      }
    }, 10);
  };
  const onMovieFocus = () => {
    if (location.pathname !== "/") return;
    movieFocus(null);
  };

  return (
    <div
      className={focused ? "btn-not-focus btn-focus" : "btn-not-focus"}
      ref={ref}
    >
      <img
        ref={myRef}
        className="more-item"
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

export default MoreItem;
