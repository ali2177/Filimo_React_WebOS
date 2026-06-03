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

const MoreBtn = ({ onFocus, linkText, uid }) => {
  const handleAction = () => {
    // console.log(focusKey);
    localStorage.setItem("moreBtn", "more-btn");
    localStorage.removeItem("seasonBtn");
    localStorage.removeItem("recommBtn");
    // localStorage.setItem("moreSingle", JSON.stringify(movieRow));
    navigate(`/moredetail/${uid}`);
  };
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress: () => {
      handleAction();
    },
    focusKey: "more-btn",
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
        توضیحات
      </div>
    </FocusContext.Provider>
  );
};

export default MoreBtn;
