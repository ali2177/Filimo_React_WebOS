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
import SubtitleDeactiveBtn from "./SubtitleDeactiveBtn";
import SuntitleBackBtn from "./SuntitleBackBtn";

const SubtitleList = ({
  onFocus,
  subtitles,
  onClose,
  type,
  onQualityEnterPress,
  onTrackSet,
}) => {
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
    // console.log(sub);
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className="subtitle-list u500"
        style={{ background: focused ? "red" : "" }}
      >
        <div className="sub-content">
          <p style={{ textAlign: "center" }}>
            {type === "subtitle" && "انتخاب زیرنویس"}
            {type === "quality" && "انتخاب کیفیت"}
            {type === "audio" && "انتخاب زبان"}
          </p>

          <hr />
          <ul className="sub-header u700">
            {subtitles.map((sub, index) => (
              <Subtitle
                focuskeey={`sub__${index}`}
                sub={sub}
                onTrackSet={onTrackSet}
                onQualitySet={onQualityEnterPress}
                type={type}
                index={index}
                onClose={onClose}
              />
            ))}
            {type !== "audio" && (
              <SubtitleDeactiveBtn
                focuskeey={`sub__${subtitles.length}`}
                onTrackSet={onTrackSet}
                onQualitySet={onQualityEnterPress}
                type={type}
              />
            )}
          </ul>

          <SuntitleBackBtn
            onClose={onClose}
            focuskeey={
              type === "audio"
                ? `sub__${subtitles.length}`
                : `sub__${subtitles.length + 1}`
            }
          />

          {/* <div
            onClickEnter={() => {
              setIsShowSubList(false);
            }}
            className="sub-header"
          >
            بستن
          </div> */}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default SubtitleList;
