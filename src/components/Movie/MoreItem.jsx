import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

function MoreItem({
  tag_id,
  onFocus,
  onEnterPress,
  movieFocus,
  focusKeey,
  type,
  movies,
  linkText,
}) {
  const { ref, focused, focusKey } = useFocusable({
    onFocus: () => {
      handleScrolling();
      onMovieFocus();
    },
    onEnterPress: () => {
      if (type === "mainPage") {
        localStorage.setItem("lastFocus", focusKeey);
        navigate(`/moremovies/${tag_id}`);
      } else if (type === "moreReccom") {
        localStorage.setItem("moreSingle", JSON.stringify(movies));
        navigate(`/moreSingle/${linkText}`);
      } else if (type === "moreCat") {
        localStorage.setItem("lastFocusCat", focusKeey);
        localStorage.setItem("moreSingle", JSON.stringify(movies));
        navigate(`/moreMovieSingle`);
      } else {
        localStorage.setItem("lastFocusMore", focusKeey);
        localStorage.setItem("moreSingle", JSON.stringify(movies));
        navigate(`/moreMovieSingle`);
      }
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
    console.log(focusKey);
    myRef.current.scrollIntoView({
      block: focusKey.slice(5, 6) === "0" ? "end" : "center",
    });
  };
  const onMovieFocus = () => {
    if (location.pathname !== "/") return;
    movieFocus(null);
  };

  return (
    <div className={focused ? "btn-focus" : "btn-not-focus"} ref={ref}>
      <Link ref={myRef} to={`/moremovies/${tag_id}`}>
        <img
          className="more-item"
          src={process.env.PUBLIC_URL + "/icon_more.png"}
          // alt={movie.movie_title_en}
        />
      </Link>
    </div>
  );
}

export default MoreItem;
