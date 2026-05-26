import { useCallback, useEffect, useRef, useState } from "react";

export function useUiTimer(videoRef, isModalOpen, isNextEpisodeShown = false) {
  const [uiVisible, setUiVisible] = useState(true);
  const timerRef          = useRef(null);
  const isModalRef        = useRef(isModalOpen);
  const isNextEpisodeRef  = useRef(isNextEpisodeShown);

  useEffect(() => { isModalRef.current       = isModalOpen;       }, [isModalOpen]);
  useEffect(() => { isNextEpisodeRef.current  = isNextEpisodeShown; }, [isNextEpisodeShown]);

  const resetUiTimer = useCallback(() => {
    if (isModalRef.current)      return;
    if (isNextEpisodeRef.current) return;
    const video = videoRef.current;
    if (!video) return;

    setUiVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!video.paused) {
      timerRef.current = setTimeout(() => setUiVisible(false), 5000);
    }
  }, [videoRef]);

  const forceHideUi = useCallback(() => {
    setUiVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Sync UI visibility on play / pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener("play",  resetUiTimer);
    video.addEventListener("pause", resetUiTimer);
    return () => {
      video.removeEventListener("play",  resetUiTimer);
      video.removeEventListener("pause", resetUiTimer);
    };
  }, [videoRef, resetUiTimer]);

  // Mouse / touch input resets the timer; re-runs when modal state changes
  useEffect(() => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    const events = ["mousemove", "mousedown", "touchstart"];
    events.forEach((e) => container.addEventListener(e, resetUiTimer));
    resetUiTimer();
    return () => events.forEach((e) => container.removeEventListener(e, resetUiTimer));
  }, [videoRef, resetUiTimer]);

  return { uiVisible, setUiVisible, resetUiTimer, forceHideUi };
}
