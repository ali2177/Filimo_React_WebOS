import React, { useEffect, useRef } from "react";

import { useNavigate, Link, useNavigation } from "react-router-dom";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";

const SeasonBtn = ({ ui_id, onFocus, onEnterPress, seriesName }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress: () => {
      localStorage.setItem("seasonBtn", "season-btn");
      localStorage.setItem("seriesName", seriesName);
      navigate(`/allepisodes/${ui_id}`);
    },
    focusKey: "season-btn",
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(focusKey);
  //   setFocus("paly-btn");
  //   // focusSelf();
  // }, [focusSelf]);
  // useEffect(() => {
  //   console.log(focusKey);
  //   focusSelf();
  // }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className={focused ? "btn-ctrl btn-play-focus u500" : "btn-ctrl u500"}
      >
        تمامی قسمت ها
      </div>
    </FocusContext.Provider>
  );
};

export default SeasonBtn;
