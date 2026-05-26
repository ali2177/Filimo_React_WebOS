import { useCallback, useEffect, useState } from "react";

export function usePlaybackControls(videoRef, hlsRef, duration) {
  const [playing, setPlaying]               = useState(false);
  const [muted, setMuted]                   = useState(false);
  const [playbackSpeed, setPlaybackSpeed]   = useState(1.0);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(-1);
  const [autoPlayNext, setAutoPlayNext]     = useState(
    () => localStorage.getItem("autoPlayNext") !== "false",
  );

  // Drive playing state from actual video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay  = () => setPlaying(true);
    const onPause = () => { if (!video.seeking) setPlaying(false); };
    video.addEventListener("play",  onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play",  onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [videoRef]);

  // Drive muted state from video element (catches autoplay muted fallback too)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onVolumeChange = () => setMuted(video.muted);
    video.addEventListener("volumechange", onVolumeChange);
    return () => video.removeEventListener("volumechange", onVolumeChange);
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  }, [videoRef]);

  const seek = useCallback((delta) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = delta === 0
      ? 0
      : Math.min(Math.max(0, v.currentTime + delta), duration);
  }, [videoRef, duration]);

  const changeQuality = useCallback((index) => {
    if (!hlsRef.current) return;
    if (index === -1) hlsRef.current.currentLevel = -1;
    else hlsRef.current.loadLevel = index;
    setSelectedLevelIndex(index);
  }, [hlsRef]);

  const changeSpeed = useCallback((rate) => {
    const v = videoRef.current;
    if (v) v.playbackRate = rate;
    setPlaybackSpeed(rate);
  }, [videoRef]);

  const toggleAutoPlayNext = useCallback(() => {
    setAutoPlayNext((prev) => {
      const next = !prev;
      localStorage.setItem("autoPlayNext", String(next));
      return next;
    });
  }, []);

  return {
    playing,
    muted,
    playbackSpeed,
    autoPlayNext,
    selectedLevelIndex,
    togglePlay,
    toggleMute,
    seek,
    changeQuality,
    changeSpeed,
    toggleAutoPlayNext,
  };
}
