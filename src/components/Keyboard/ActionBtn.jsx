import React from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const ActionBtn = ({ onFocus, onEnter, type }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress: () => {
      onEnter(type);
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
        focused
          ? "keyboard-btn u700 keyboard-btn-action-focus"
          : "keyboard-btn-action u700"
      }
      ref={ref}
    >
      {type}
    </div>
  );
};

export default ActionBtn;
