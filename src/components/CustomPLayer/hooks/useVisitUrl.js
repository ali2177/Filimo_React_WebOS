import { useEffect, useRef } from "react";

/**
 * Pings the movie's `visit_url` (formAction) every 2 seconds while the video is
 * playing, and stops while it is paused/ended. This is the watch-heartbeat the
 * backend uses to track viewing sessions.
 */
export function useVisitUrl(videoRef, visitUrl, intervalMs = 2000) {
  const intervalRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !visitUrl) return;

    const ping = () => {
      fetch(visitUrl, { method: "GET", redirect: "follow" }).catch((error) => {
        console.log(error);
      });
    };

    const start = () => {
      if (intervalRef.current) return; // already running
      ping(); // fire immediately on play
      intervalRef.current = setInterval(ping, intervalMs);
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    video.addEventListener("playing", start);
    video.addEventListener("play", start);
    video.addEventListener("pause", stop);
    video.addEventListener("ended", stop);

    // if the video is already playing when the hook mounts, start right away
    if (!video.paused && !video.ended) start();

    return () => {
      video.removeEventListener("playing", start);
      video.removeEventListener("play", start);
      video.removeEventListener("pause", stop);
      video.removeEventListener("ended", stop);
      stop();
    };
  }, [videoRef, visitUrl, intervalMs]);
}
