import React, { useEffect, useCallback } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const ModalBtn = ({ text, onClick, focuskeey }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onEnterPress: () => {
      onClick();
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focuskeey,
  });

  return (
    <div
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={onClick}
      ref={ref}
      className={
        focused
          ? "subtitle-item-wrapper u700 active-quality"
          : "subtitle-item-wrapper u700"
      }
    >
      {text}
    </div>
  );
};

export default ModalBtn;
