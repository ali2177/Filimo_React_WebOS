import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const SubtitleDeactiveBtn = ({
  sub,
  onTrackSet,
  focuskeey,
  type,
  onQualitySet,
}) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      localStorage.setItem("focusedSub", "none");
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
    <li
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={() => {
        if (type === "subtitle") {
          onTrackSet("none");
        } else if (type === "quality") {
          onQualitySet(-1);
        }
      }}
      ref={ref}
      className={
        focused
          ? "subtitle-item-wrapper active-quality"
          : "subtitle-item-wrapper"
      }
    >
      {type === "quality" && "خودکار"}
      {type === "subtitle" && "خاموش"}
    </li>
  );
};

export default SubtitleDeactiveBtn;
