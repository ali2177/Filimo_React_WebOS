import React, { useEffect, useState } from "react";
import { TVPlayer, useTVPlayerStore } from "react-tv-player";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { type } from "@testing-library/user-event/dist/type";

const Subtitle = ({
  sub,
  onTrackSet,
  focuskeey,
  type,
  index,
  onQualitySet,
  onClose,
}) => {
  const player = useTVPlayerStore((s) => s.player);
  const [activeSubtitle, setActiveSubtitle] = useState(null);
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      if (type === "audio") {
        localStorage.setItem("focusedSub", sub.lang);
      } else {
        localStorage.setItem("focusedSub", sub.language);
      }
      // console.log("focus");
    },
    onEnterPress: () => {
      onTrackSet(sub.lng, index);
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focuskeey,
  });
  useEffect(() => {
    // focusSelf();
    // alternatively
    // console.log(`sub__${player.getInternalPlayer("hls").currentLevel}`);
  }, []);
  useEffect(() => {
    if (player.getInternalPlayer()?.textTracks.length > 0) {
      let foundActive = false;
      for (let i = 0; i < player.getInternalPlayer()?.textTracks.length; i++) {
        if (player.getInternalPlayer()?.textTracks[i].mode === "showing") {
          setActiveSubtitle(i); // or label if you prefer
          localStorage.setItem("activeSub", i);
          foundActive = true;
          break;
        }
      }
      if (!foundActive) {
        localStorage.setItem(
          "activeSub",
          player.getInternalPlayer()?.textTracks.length
        );
        setActiveSubtitle(player.getInternalPlayer()?.textTracks.length);
      }
    }
  }, [player.getInternalPlayer()?.textTracks]);

  useEffect(() => {
    if (type === "subtitle") {
      setFocus(`sub__${activeSubtitle}`);
    } else if (type === "audio") {
      setFocus(`sub__${player.getInternalPlayer("hls").audioTrack}`);
    } else if (type === "quality") {
      setFocus(`sub__${player.getInternalPlayer("hls").currentLevel}`);
    }
  }, [
    activeSubtitle,
    player.getInternalPlayer("hls").audioTrack,
    player.getInternalPlayer("hls").currentLevel,
  ]);

  return (
    <li
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={() => {
        if (type === "subtitle") {
          localStorage.setItem("activeSub", index);
          onTrackSet(sub.language);
          onClose();
        } else if (type === "quality") {
          onQualitySet(index);
        } else if (type === "audio") {
          onTrackSet(sub.lang);
        }
      }}
      ref={ref}
      className={
        focused
          ? "subtitle-item-wrapper active-quality"
          : "subtitle-item-wrapper"
      }
    >
      <div className="subtitle-item">
        {type === "quality" && (
          <>
            {focuskeey ===
            `sub__${player.getInternalPlayer("hls").currentLevel}` ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="radio-button"
                width="512"
                height="512"
                x="0"
                y="0"
                version="1.1"
                viewBox="0 0 512 512"
                className="subtile-svg"
              >
                {" "}
                <path
                  id="Icon_21_"
                  d="M256 152c-57.2 0-104 46.8-104 104s46.8 104 104 104 104-46.8 104-104-46.8-104-104-104zm0-104C141.601 48 48 141.601 48 256s93.601 208 208 208 208-93.601 208-208S370.399 48 256 48zm0 374.4c-91.518 0-166.4-74.883-166.4-166.4S164.482 89.6 256 89.6 422.4 164.482 422.4 256 347.518 422.4 256 422.4z"
                ></path>{" "}
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="radio-button"
                className="subtile-svg"
              >
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
              </svg>
            )}
          </>
        )}
        {type === "subtitle" && (
          <>
            {focuskeey === `sub__${activeSubtitle}` ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="radio-button"
                width="512"
                height="512"
                x="0"
                y="0"
                version="1.1"
                viewBox="0 0 512 512"
                className="subtile-svg"
              >
                {" "}
                <path
                  id="Icon_21_"
                  d="M256 152c-57.2 0-104 46.8-104 104s46.8 104 104 104 104-46.8 104-104-46.8-104-104-104zm0-104C141.601 48 48 141.601 48 256s93.601 208 208 208 208-93.601 208-208S370.399 48 256 48zm0 374.4c-91.518 0-166.4-74.883-166.4-166.4S164.482 89.6 256 89.6 422.4 164.482 422.4 256 347.518 422.4 256 422.4z"
                ></path>{" "}
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="radio-button"
                className="subtile-svg"
              >
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
              </svg>
            )}
          </>
        )}
        {type === "audio" && (
          <>
            {focuskeey ===
            `sub__${player.getInternalPlayer("hls").audioTrack}` ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="radio-button"
                width="512"
                height="512"
                x="0"
                y="0"
                version="1.1"
                viewBox="0 0 512 512"
                className="subtile-svg"
              >
                {" "}
                <path
                  id="Icon_21_"
                  d="M256 152c-57.2 0-104 46.8-104 104s46.8 104 104 104 104-46.8 104-104-46.8-104-104-104zm0-104C141.601 48 48 141.601 48 256s93.601 208 208 208 208-93.601 208-208S370.399 48 256 48zm0 374.4c-91.518 0-166.4-74.883-166.4-166.4S164.482 89.6 256 89.6 422.4 164.482 422.4 256 347.518 422.4 256 422.4z"
                ></path>{" "}
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="radio-button"
                className="subtile-svg"
              >
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
              </svg>
            )}
          </>
        )}

        {type === "subtitle" && (
          <span className="subtitle-content">{sub.language}</span>
        )}
        {type === "quality" && (
          <span className="subtitle-content">{sub.name}</span>
        )}
        {type === "audio" && (
          <span className="subtitle-content">{sub.name}</span>
        )}
      </div>
    </li>
  );
};

export default Subtitle;
