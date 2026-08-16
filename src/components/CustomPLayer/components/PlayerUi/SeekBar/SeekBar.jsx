import React, { useRef, useState, useEffect } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../../context/PlayerContext";
import { formatTime }        from "../../../utils/formatTime";
import { toFarsiDigits }     from "../../../utils/toFarsiDigits";
import { resumeAfterSeek }   from "../../../utils/resumeAfterSeek";
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

  // Position the scrub marker points at (keyboard arrows / mouse hover).
  const [scrubTime, setScrubTime]   = useState(0);
  // Optimistic played position right after a committed seek, until the video
  // actually catches up (avoids the bar snapping back to the old time).
  const [seekPending, setSeekPending] = useState(null);

  const scrubTimeRef      = useRef(0);
  const durationRef       = useRef(duration);
  const currentTimeRef    = useRef(currentTime);
  // Refs to avoid stale closures in event handlers
  const seekbarActiveRef  = useRef(false);
  const focusedRef        = useRef(false);
  const mouseOverRef      = useRef(false);
  // Debounce timer for live keyboard seeking (see onArrowPress)
  const seekDebounceRef   = useRef(null);

  useEffect(() => { durationRef.current      = duration;      }, [duration]);
  useEffect(() => { currentTimeRef.current   = currentTime;   }, [currentTime]);
  useEffect(() => { scrubTimeRef.current     = scrubTime;     }, [scrubTime]);
  useEffect(() => { seekbarActiveRef.current = seekbarActive; }, [seekbarActive]);

  // Commit a seek to the main video and recover if it stalls in an unbuffered
  // region (shared with the click handler and the ±15s buttons).
  const commitSeek = (target) => {
    const v = videoRef.current;
    if (!v || !durationRef.current) return;
    const clamped = Math.max(0, Math.min(durationRef.current, target));
    const wasPlaying = !v.paused;
    v.currentTime = clamped;
    setSeekPending((clamped / durationRef.current) * 100);
    resetUiTimer();
    if (wasPlaying) resumeAfterSeek(v, clamped);
  };

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
        // Arrows move the scrub marker AND live-seek the video — no OK press
        // needed. The actual seek is debounced so a burst of rapid presses
        // coalesces into a single commit; this gives real-time seeking while
        // still avoiding the per-press live-seek thrash that stalled the buffer.
        if (seekbarActiveRef.current) {
          const delta = dir === "right" ? 15 : -15;
          const next  = Math.max(0, Math.min(durationRef.current || 0, scrubTimeRef.current + delta));
          scrubTimeRef.current = next;
          setScrubTime(next);

          clearTimeout(seekDebounceRef.current);
          seekDebounceRef.current = setTimeout(() => {
            if (Math.abs(scrubTimeRef.current - currentTimeRef.current) > 0.5) {
              commitSeek(scrubTimeRef.current);
            }
          }, 400);
        }
        return false; // always block spatial nav
      }
    },
    onEnterPress: () => {
      // Commit the scrubbed position immediately, then leave scrub mode.
      clearTimeout(seekDebounceRef.current);
      if (Math.abs(scrubTimeRef.current - currentTimeRef.current) > 0.5) {
        commitSeek(scrubTimeRef.current);
      }
      setSeekbarActive(false);
      setFocus("Play");
      resetUiTimer();
    },
  });

  // Keyboard: enter / leave scrub mode
  useEffect(() => {
    focusedRef.current = focused;
    if (focused) {
      const t = currentTimeRef.current;
      scrubTimeRef.current = t;
      setScrubTime(t);
      setSeekbarActive(true);
    } else if (!mouseOverRef.current) {
      setSeekbarActive(false);
      clearTimeout(seekDebounceRef.current); // drop any pending live seek
    }
  }, [focused]);

  // Clear any pending live-seek timer on unmount
  useEffect(() => () => clearTimeout(seekDebounceRef.current), []);

  // ── Mouse hover scrub ──────────────────────────────────────────────────────

  const handleMouseEnter = () => {
    mouseOverRef.current = true;
    const t = currentTimeRef.current;
    scrubTimeRef.current = t;
    setScrubTime(t);
    setSeekbarActive(true);
  };

  const handleMouseMove = (e) => {
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t     = ratio * (durationRef.current || 0);
    scrubTimeRef.current = t;
    setScrubTime(t);
  };

  const handleMouseLeave = () => {
    mouseOverRef.current = false;
    if (!focusedRef.current) {
      setSeekbarActive(false);
    }
  };

  // Auto-clear seekPending once the video catches up to the committed position
  useEffect(() => {
    if (seekPending !== null) {
      const playedPercent = duration ? (currentTime / duration) * 100 : 0;
      if (Math.abs(playedPercent - seekPending) < 1) {
        setSeekPending(null);
      }
    }
  }, [currentTime, duration, seekPending]);

  // ── Derived percentages ────────────────────────────────────────────────────

  const playedPercent = duration ? (currentTime / duration) * 100 : 0;
  const scrubPercent  = duration ? (scrubTime   / duration) * 100 : 0;

  // Single source of truth for bar, thumb, and time label
  const displayPercent = seekPending ?? playedPercent;
  const activePercent  = seekbarActive ? scrubPercent : displayPercent;
  const activeTime     = duration ? (activePercent / 100) * duration : 0;

  // Keyboard scrubbing moves the white bar + thumb in real time (arrows commit
  // the seek on a debounce, so the played position would otherwise lag until the
  // video catches up). Mouse hover keeps the thumb at the playback position and
  // shows a separate thin preview marker instead.
  const keyboardScrub = focused && seekbarActive;
  const barPercent    = keyboardScrub ? scrubPercent : displayPercent;

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="controls-row row-seekbar">

        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-container"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              const rect  = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              if (duration) commitSeek(ratio * duration);
            }}
          >
            <div className="progress-buffered" style={{ width: `${bufferedPercent}%` }} />
            <div className="progress-played"   style={{ transform: `scaleX(${barPercent / 100})` }} />
            <div
              className={`progress-thumb${focused ? " progress-thumb-active" : ""}`}
              style={{ left: `${barPercent}%` }}
            />
            {seekbarActive && !keyboardScrub && (
              <div className="progress-preview-marker" style={{ left: `${scrubPercent}%` }} />
            )}
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
