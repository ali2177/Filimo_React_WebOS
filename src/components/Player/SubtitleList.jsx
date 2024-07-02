import React, { useState, useEffect } from "react";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import Subtitle from "./Subtitle";

const SubtitleList = ({ onFocus, subtitles }) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onFocus,
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  //   useEffect(() => {
  //     // focusSelf();
  //     // alternatively
  //     setFocus("sub");
  //   }, [focusSelf]);
  const onSubtitleTrackSet = (sub) => {
    console.log(sub);
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="subtitle-list u500"
        style={{ background: focused ? "red" : "" }}
      >
        <div className="sub-content">
          <p style={{ textAlign: "center" }}>انتخاب زیرنویس</p>

          <hr />
          <ul ref={ref}>
            {subtitles.map((sub) => (
              <Subtitle sub={sub} onTrackSet={onSubtitleTrackSet} />
            ))}
            <li>
              <div
                onClickEnter={() => {
                  setTreackLang("none");
                  setIsShowSubList(false);
                }}
                className="sub-header u700"
              >
                خاموش
              </div>
            </li>
          </ul>
          <div
            onClickEnter={() => {
              setIsShowSubList(false);
            }}
            className="sub-header"
          >
            بستن
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default SubtitleList;
