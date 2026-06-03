import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../../context/PlayerContext";
import { formatTime }     from "../../../utils/formatTime";
import { toFarsiDigits }  from "../../../utils/toFarsiDigits";
import "./SeekBar.css";

const SeekBar = () => {
  const {
    videoRef,
    currentTime,
    duration,
    bufferedPercent,
    resetUiTimer,
    seekbarActive,
    setSeekbarActive,
  } = usePlayerContext();

  const [scrubTime, setScrubTime] = useState(0);
  const [seekPending, setSeekPending] = useState(null); // immediate visual after click

  const scrubTimeRef     = useRef(0);
  const durationRef      = useRef(duration);
  const currentTimeRef   = useRef(currentTime);
  const seekbarActiveRef = useRef(false);
  const focusedRef       = useRef(false);
  const mouseOverRef     = useRef(false);

  useEffect(() => { durationRef.current    = duration;    }, [duration]);
  useEffect(() => { currentTimeRef.current = currentTime; }, [currentTime]);
  useEffect(() => { seekbarActiveRef.current = seekbarActive; }, [seekbarActive]);

  const { ref, focusKey, focused } = useFocusable({
    focusKey: "seekbar",
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
    onArrowPress: (dir) => {
      if (dir === "up") {
        if (seekbarActiveRef.current) {
          setSeekbarActive(false);
          setFocus("Play");
        }
        return false;
      }
      if (dir === "right" || dir === "left") {
        if (seekbarActiveRef.current) {
          const delta = dir === "right" ? 15 : -15;
          const next  = Math.max(0, Math.min(durationRef.current || 0, scrubTimeRef.current + delta));
          scrubTimeRef.current = next;
          setScrubTime(next);
          const main = videoRef.current;
          if (main) main.currentTime = next;
        }
        return false;
      }
    },
    onEnterPress: () => {
      setSeekbarActive(false);
      setFocus("Play");
      resetUiTimer();
    },
  });

  // Enter / leave keyboard scrub mode on focus change
  useEffect(() => {
    focusedRef.current = focused;
    if (focused) {
      const t = currentTimeRef.current;
      scrubTimeRef.current = t;
      setScrubTime(t);
      setSeekbarActive(true);
    } else if (!mouseOverRef.current) {
      setSeekbarActive(false);
    }
  }, [focused]);

  const handleMouseEnter = useCallback(() => {
    mouseOverRef.current = true;
    setSeekbarActive(true);
  }, [setSeekbarActive]);

  const handleMouseLeave = useCallback(() => {
    mouseOverRef.current = false;
    if (!focusedRef.current) setSeekbarActive(false);
  }, [setSeekbarActive]);

  const playedPercent = duration ? (currentTime / duration) * 100 : 0;
  const scrubPercent  = duration ? (scrubTime   / duration) * 100 : 0;

  // Clear the pending-seek visual override once the video has caught up
  useEffect(() => {
    if (seekPending !== null && Math.abs(playedPercent - seekPending) < 1) {
      setSeekPending(null);
    }
  }, [playedPercent, seekPending]);

  // Use seekPending (set instantly on click) so thumb+bar move together without waiting for timeupdate
  const displayPercent = seekPending ?? playedPercent;
  // In keyboard scrub mode both bar and thumb use scrubPercent (instant); in mouse mode both use displayPercent
  const activePercent = focused ? scrubPercent : displayPercent;
  const activeTime    = duration ? (activePercent / 100) * duration : 0;

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="controls-row row-seekbar">

        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              const rect  = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              const v     = videoRef.current;
              if (v && duration) {
                const t = ratio * duration;
                v.currentTime = t;
                setSeekPending(ratio * 100); // immediate visual — thumb+bar snap together
                resetUiTimer();
              }
            }}
          >
            <div className="progress-buffered" style={{ width: `${bufferedPercent}%` }} />
            <div className="progress-played"   style={{ transform: `scaleX(${activePercent / 100})` }} />
            <div
              className={`progress-thumb${focused ? " progress-thumb-active" : ""}`}
              style={{ left: `${activePercent}%` }}
            />
          </div>
        </div>

        <div className="seekbar-conteoller-wrapper">
          <span className="u500">{toFarsiDigits(formatTime(activeTime))}</span>
          <span>{toFarsiDigits(formatTime(duration))}</span>
        </div>

      </div>
    </FocusContext.Provider>
  );
};

export default SeekBar;
