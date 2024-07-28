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

const PlayBotton = ({ data, onFocus, onEnterPress }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress,
    focusKey: "paly-btn",
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
        className={focused ? "btn-play btn-play-focus u500" : "btn-play u500"}
      >
        {data?.data?.watch_action.link_text}
      </div>
    </FocusContext.Provider>
  );
};

export default PlayBotton;
