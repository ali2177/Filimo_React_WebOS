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

const SeasonBtn = ({ ui_id, onFocus, onEnterPress }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress: () => {
      navigate(`/allepisodes/${ui_id}`);
    },
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
        className="btn-ctrl u500"
        style={{
          backgroundColor: focused ? "green" : "black",
          color: "white",
        }}
      >
        تمامی قسمت ها
      </div>
    </FocusContext.Provider>
  );
};

export default SeasonBtn;
