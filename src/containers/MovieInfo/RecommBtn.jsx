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

const RecommBtn = ({ onFocus, linkText, uid }) => {
  const handleAction = () => {
    // console.log(focusKey);
    localStorage.setItem("recommBtn", "recomm-btn");
    localStorage.removeItem("seasonBtn");
    localStorage.removeItem("moreBtn");
    // localStorage.setItem("moreSingle", JSON.stringify(movieRow));
    navigate(`/morereccom/${uid}`);
  };
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress: () => {
      handleAction();
    },
    focusKey: "recomm-btn",
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
        onMouseEnter={() => {
          setFocus(focusKey);
        }}
        onClick={handleAction}
      >
        فیلم های پیشنهادی
      </div>
    </FocusContext.Provider>
  );
};

export default RecommBtn;
