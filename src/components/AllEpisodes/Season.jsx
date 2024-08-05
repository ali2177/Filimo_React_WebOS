import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const Season = ({ title, count, onEnterPress }) => {
  const { ref, focused, focusSelf } = useFocusable({
    onEnterPress,
    onArrowPress: (e) => {
      if (e === "right") {
        setFocus("Episode_0");
      }
    },
    focusKey: title,
  });
  useEffect(() => {
    if (localStorage.getItem("lastSeasonFocus")) {
      setFocus(localStorage.getItem("lastSeasonFocus"));
    } else {
      focusSelf();
    }
  }, []);
  return (
    <li
      ref={ref}
      className={focused ? "season-count-focused u500" : "u500"}
      onClick={() => {
        // console.log(season.movies.data);
        // setCurretSeasonChosen(season.movies.data);
      }}
    >
      {title}
      <div>
        <span>{count}</span>
        <span>قسمت</span>
      </div>
    </li>
  );
};

export default Season;
