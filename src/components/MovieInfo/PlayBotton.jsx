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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            d="M9.45332 26.6666C9.15304 26.6818 8.85406 26.6174 8.58666 26.48C6.82666 25.44 6.66666 18.1066 6.66666 15.8933C6.66666 13.1066 6.85332 6.55996 8.57332 5.54663C10.3067 4.53329 16.0667 7.65329 18.4667 9.03996C20.4 10.1466 26.6667 13.9066 26.6667 16C26.6667 18.0933 21.0133 21.4933 18.5733 22.8933C16.4533 24.1066 11.76 26.6666 9.45332 26.6666Z"
            fill="white"
          />
        </svg>
        {data?.data?.watch_action.link_text}
      </div>
    </FocusContext.Provider>
  );
};

export default PlayBotton;
