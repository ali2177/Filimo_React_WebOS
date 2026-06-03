import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const SuntitleBackBtn = ({ sub, onTrackSet, focuskeey, onClose }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      // console.log("focus");
    },
    onEnterPress: () => {
      onTrackSet(sub.lng);
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
      onClick={onClose}
      ref={ref}
      className={
        focused
          ? "subtitle-item-wrapper active-quality"
          : "subtitle-item-wrapper"
      }
    >
      بستن
    </div>
  );
};

export default SuntitleBackBtn;
