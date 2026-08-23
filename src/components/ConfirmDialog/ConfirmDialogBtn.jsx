import React from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const ConfirmDialogBtn = ({ text, focusKey, onPress }) => {
  const { ref, focused } = useFocusable({
    focusKey,
    onEnterPress: onPress,
  });

  return (
    <button
      ref={ref}
      type="button"
      className={
        focused
          ? "confirm-dialog-btn u500 confirm-dialog-btn-focus"
          : "confirm-dialog-btn u500"
      }
      onMouseEnter={() => setFocus(focusKey)}
      onClick={onPress}
    >
      {text}
    </button>
  );
};

export default ConfirmDialogBtn;
