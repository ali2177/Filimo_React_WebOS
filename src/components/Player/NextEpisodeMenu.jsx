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
import NextEpisodesItem from "./NextEpisodesItem";
import NextEpisodesExit from "./NextEpisodesExit";

const NextEpisodeMenu = ({
  nextEpisodeTitle,
  nextEpisodeUid,
  currentUid,
  onclose,
  onCounterFinish,
}) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  useEffect(() => {
    let counter;
    // focusSelf();
    // alternatively
    setFocus("next-episode-player__0");
    const interval = setInterval(() => {
      counter++;
    }, 1000);
  }, []);
  const onSubtitleTrackSet = (sub) => {
    // console.log(sub);
  };

  // console.log(nextEpisodeTitle);
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="next-episode-menu u500"
        style={{ background: focused ? "red" : "" }}
      >
        {/* <div className="next-episode-menu-bg" /> */}

        {/* <ul style={{ listStyle: "none" }} ref={ref}>
              {nextEpisodeUid && nextEpisodeTitle && (
                <NextEpisodesItem
                  title="قسمت بعدی"
                  desc={nextEpisodeTitle}
                  nextUid={nextEpisodeUid}
                  currentUid={currentUid}
                  focuskeey="next-episode"
                />
              )}

              <NextEpisodesItem
                title="بازگشت به صفحه فیلم"
                currentUid={currentUid}
                focuskeey="back-movie-page"
              />
              <NextEpisodesItem
                title="پخش مجدد"
                currentUid={currentUid}
                focuskeey="replay"
              />
            </ul> */}
        <NextEpisodesExit onEnterPress={onclose} />
        <NextEpisodesItem
          nextUid={nextEpisodeUid}
          onCounterFinish={onCounterFinish}
        />
      </div>
    </FocusContext.Provider>
  );
};

export default NextEpisodeMenu;
