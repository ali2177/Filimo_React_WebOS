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

const NextEpisodeMenu = ({ nextEpisodeTitle, nextEpisodeUid, currentUid }) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  useEffect(() => {
    // focusSelf();
    // alternatively
    if (nextEpisodeTitle) {
      setFocus("next-episode");
    } else {
      setFocus("back-movie-page");
    }
  }, []);
  const onSubtitleTrackSet = (sub) => {
    console.log(sub);
  };

  // console.log(nextEpisodeTitle);
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="next-episode-menu u500"
        style={{ background: focused ? "red" : "" }}
      >
        <div style={{ position: "relative", height: "100%" }}>
          {/* <div className="next-episode-menu-bg" /> */}
          <div className="next-episode-menu-content">
            <ul style={{ listStyle: "none" }} ref={ref}>
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
            </ul>
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default NextEpisodeMenu;
