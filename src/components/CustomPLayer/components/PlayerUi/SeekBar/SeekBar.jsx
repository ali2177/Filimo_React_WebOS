import React, { useRef, useState, useEffect, useCallback } from "react";
import Hls from "hls.js";
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
    src,
    currentTime,
    duration,
    bufferedPercent,
    resetUiTimer,
    seekbarActive,
    setSeekbarActive,
  } = usePlayerContext();

  const [previewTime, setPreviewTime] = useState(0);
  const [previewReady, setPreviewReady] = useState(false);
  const [seekPending, setSeekPending] = useState(null);

  const canvasRef = useRef(null);
  const previewVideoRef = useRef(null);
  const previewHlsRef = useRef(null);
  const manifestReadyRef = useRef(false);

  const previewTimeRef    = useRef(0);
  const durationRef       = useRef(duration);
  const currentTimeRef    = useRef(currentTime);
  // Refs to avoid stale closures in event handlers
  const seekbarActiveRef  = useRef(false);
  const focusedRef        = useRef(false);
  const mouseOverRef      = useRef(false);

  useEffect(() => { durationRef.current    = duration;      }, [duration]);
  useEffect(() => { currentTimeRef.current = currentTime;   }, [currentTime]);
  useEffect(() => { previewTimeRef.current = previewTime;   }, [previewTime]);
  useEffect(() => { seekbarActiveRef.current = seekbarActive; }, [seekbarActive]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video  = previewVideoRef.current;
    if (!canvas || !video) return;
    try {
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      setPreviewReady(true);
    } catch (_) {}
  }, []);

  const seekAndPreview = useCallback((time) => {
    const v   = previewVideoRef.current;
    const hls = previewHlsRef.current;
    if (!v || !hls) return;
    setPreviewReady(false);
    hls.stopLoad();
    hls.startLoad(time);
    v.currentTime = time;
    v.addEventListener("seeked", drawFrame, { once: true });
  }, [drawFrame]);

  // Initialize preview HLS on mount
  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video || !src) return;

    const hls = new Hls({
      startLevel: 0,
      autoStartLoad: false,
      maxBufferLength: 8,
      backBufferLength: 0,
      renderTextTracksNatively: false,
    });
    hls.loadSource(src);
    hls.attachMedia(video);
    previewHlsRef.current = hls;

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      manifestReadyRef.current = true;
    });

    return () => {
      hls.destroy();
      previewHlsRef.current  = null;
      manifestReadyRef.current = false;
    };
  }, [src]);

  // When keyboard scrub mode opens: load first frame
  useEffect(() => {
    if (!seekbarActive) {
      setPreviewReady(false);
      return;
    }
    const t   = currentTimeRef.current;
    const hls = previewHlsRef.current;
    const vid = previewVideoRef.current;
    if (!hls || !vid) return;
    if (manifestReadyRef.current) {
      hls.startLoad(t);
      vid.currentTime = t;
      vid.addEventListener("seeked", drawFrame, { once: true });
    }
  }, [seekbarActive, drawFrame]);

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
        // Only seek when actually in scrub mode — guards against UI-hidden arrow presses
        if (seekbarActiveRef.current) {
          const delta = dir === "right" ? 15 : -15;
          const next  = Math.max(0, Math.min(durationRef.current || 0, previewTimeRef.current + delta));
          previewTimeRef.current = next;
          setPreviewTime(next);
          seekAndPreview(next);
          const main = videoRef.current;
          if (main) main.currentTime = next;
          if (durationRef.current) setSeekPending((next / durationRef.current) * 100);
        }
        return false; // always block spatial nav
      }
    },
    onEnterPress: () => {
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
      previewTimeRef.current = t;
      setPreviewTime(t);
      setSeekbarActive(true);
    } else if (!mouseOverRef.current) {
      setSeekbarActive(false);
    }
  }, [focused]);

  // ── Mouse hover scrub ──────────────────────────────────────────────────────

  const handleMouseEnter = useCallback(() => {
    mouseOverRef.current = true;
    const t = currentTimeRef.current;
    previewTimeRef.current = t;
    setPreviewTime(t);
    setSeekbarActive(true);
    seekAndPreview(t);
  }, [seekAndPreview, setSeekbarActive]);

  const handleMouseMove = useCallback((e) => {
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t     = ratio * (durationRef.current || 0);
    previewTimeRef.current = t;
    setPreviewTime(t);
    seekAndPreview(t);
  }, [seekAndPreview]);

  const handleMouseLeave = useCallback(() => {
    mouseOverRef.current = false;
    if (!focusedRef.current) {
      setSeekbarActive(false);
    }
  }, [setSeekbarActive]);

  // Auto-clear seekPending once the video catches up to the clicked position
  useEffect(() => {
    if (seekPending !== null) {
      const playedPercent = duration ? (currentTime / duration) * 100 : 0;
      if (Math.abs(playedPercent - seekPending) < 1) {
        setSeekPending(null);
      }
    }
  }, [currentTime, duration, seekPending]);

  // ── Derived percentages ────────────────────────────────────────────────────

  const playedPercent  = duration ? (currentTime  / duration) * 100 : 0;
  const previewPercent = duration ? (previewTime   / duration) * 100 : 0;
  const clampedLeft    = Math.max(4, Math.min(96, previewPercent));

  // Single source of truth for bar, thumb, and time label
  const displayPercent = seekPending ?? playedPercent;
  const activePercent  = seekbarActive ? previewPercent : displayPercent;
  const activeTime     = duration ? (activePercent / 100) * duration : 0;

  return (
    <FocusContext.Provider value={focusKey}>
      <video ref={previewVideoRef} muted playsInline style={{ display: "none" }} />

      <div ref={ref} className="controls-row row-seekbar">

        {seekbarActive && (
          <div className="seekbar-preview" style={{ left: `${clampedLeft}%` }}>
            <canvas
              ref={canvasRef}
              width={240}
              height={135}
              className={`seekbar-preview-canvas${previewReady ? "" : " seekbar-preview-placeholder"}`}
            />
            <span className="seekbar-preview-time">
              {toFarsiDigits(formatTime(previewTime))}
            </span>
          </div>
        )}

        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-container"
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              const rect  = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              const v     = videoRef.current;
              if (v && duration) {
                const wasPlaying = !v.paused;
                v.currentTime = ratio * duration;
                setSeekPending(ratio * 100);
                resetUiTimer();
                if (wasPlaying) {
                  v.addEventListener("seeked", () => v.play().catch(() => {}), { once: true });
                }
              }
            }}
          >
            <div className="progress-buffered" style={{ width: `${bufferedPercent}%` }} />
            <div className="progress-played"   style={{ transform: `scaleX(${displayPercent / 100})` }} />
            <div
              className={`progress-thumb${focused ? " progress-thumb-active" : ""}`}
              style={{ left: `${displayPercent}%` }}
            />
            {seekbarActive && (
              <div className="progress-preview-marker" style={{ left: `${previewPercent}%` }} />
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
