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

import "./PlayerButton.css";

const PLayerButton = ({
  onFocus,
  onEnterPress,
  focuskey,
  handleAction,
  children,
}) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress: () => {
      console.log("here pressed");
      handleAction();
    },
    focusKey: focuskey,
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
        className={
          focused
            ? "Player-button Player-button-focus u400"
            : "Player-button u400"
        }
        onMouseEnter={() => {
          setFocus(focusKey);
        }}
        onClick={handleAction}
      >
        {children}
      </div>
    </FocusContext.Provider>
  );
};

export default PLayerButton;
