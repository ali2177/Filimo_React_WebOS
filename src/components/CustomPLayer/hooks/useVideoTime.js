import { useState, useEffect, useRef } from "react";

export function useVideoTime(videoRef) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);

  const lastSecRef      = useRef(-1);
  const bufferTimerRef  = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fire at most once per integer second — biggest render-budget win on Tizen
    const updateTime = () => {
      const sec = Math.floor(video.currentTime);
      if (sec !== lastSecRef.current) {
        lastSecRef.current = sec;
        setCurrentTime(video.currentTime);
      }
    };

    const updateDuration = () => setDuration(video.duration);

    // Debounce buffer updates to 500 ms — "progress" events fire very rapidly
    const updateBuffered = () => {
      clearTimeout(bufferTimerRef.current);
      bufferTimerRef.current = setTimeout(() => {
        if (!video.duration || !video.buffered.length) return;
        const end = video.buffered.end(video.buffered.length - 1);
        setBufferedPercent((end / video.duration) * 100);
      }, 500);
    };

    video.addEventListener("timeupdate",    updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("progress",       updateBuffered);

    return () => {
      video.removeEventListener("timeupdate",    updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("progress",       updateBuffered);
      clearTimeout(bufferTimerRef.current);
    };
  }, [videoRef]);

  return { currentTime, duration, bufferedPercent };
}
