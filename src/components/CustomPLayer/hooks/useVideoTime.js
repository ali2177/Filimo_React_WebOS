// useVideoTime.js
import { useState, useEffect } from "react";

export function useVideoTime(videoRef) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const updateBuffered = () => {
      if (!video.duration || !video.buffered.length) return;
      const end = video.buffered.end(video.buffered.length - 1);
      setBufferedPercent((end / video.duration) * 100);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("progress", updateBuffered);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("progress", updateBuffered);
    };
  }, [videoRef]);

  return { currentTime, duration, bufferedPercent };
}
