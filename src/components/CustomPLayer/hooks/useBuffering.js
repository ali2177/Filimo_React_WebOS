import { useEffect, useState } from "react";

export function useBuffering(videoRef) {
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const show = () => setIsBuffering(true);
    const hide = () => setIsBuffering(false);

    video.addEventListener("waiting",        show);
    video.addEventListener("playing",        hide);
    video.addEventListener("canplay",        hide);
    video.addEventListener("canplaythrough", hide);
    video.addEventListener("pause",          hide);

    return () => {
      video.removeEventListener("waiting",        show);
      video.removeEventListener("playing",        hide);
      video.removeEventListener("canplay",        hide);
      video.removeEventListener("canplaythrough", hide);
      video.removeEventListener("pause",          hide);
    };
  }, [videoRef]);

  return { isBuffering };
}
