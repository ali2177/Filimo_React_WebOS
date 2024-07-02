import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import { useNavigate } from "react-router-dom";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

function MoreItem({
  tag_id,
  onFocus,
  onEnterPress,
  focusKeey,
  type,
  movies,
  linkText,
}) {
  const { ref, focused, focusKey } = useFocusable({
    onFocus,
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
        navigate(`/moreSingle/${linkText}`);
      } else {
        localStorage.setItem("lastFocusMore", focusKeey);
        localStorage.setItem("moreSingle", JSON.stringify(movies));
        navigate(`/moreSingle/${linkText}`);
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

  return (
    <div className={focused ? "btn-focus" : "btn-not-focus"} ref={ref}>
      <Link to={`/moremovies/${tag_id}`}>
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
