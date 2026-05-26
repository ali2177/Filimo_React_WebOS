import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const Word = ({ onFocus, onEnter, item }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress: () => {
      onEnter(item);
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });

  return (
    <div
      className={
        focused ? "keyboard-btn u700 keyboard-btn-focus" : "keyboard-btn u700"
      }
      ref={ref}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={() => {
        onEnter(item);
      }}
    >
      {item}
    </div>
  );
};

export default Word;
