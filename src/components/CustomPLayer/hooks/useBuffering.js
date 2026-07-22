import { useEffect, useState } from "react";

export function useBuffering(videoRef) {
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const show = () => setIsBuffering(true);
    const hide = () => setIsBuffering(false);
    // A stalled seek fires `pause` while `seeking` is still true — don't hide the
    // spinner then, or the player looks like a silent black screen. Show the
    // spinner during the seek and keep it until playback actually resumes.
    const onPause = () => { if (!video.seeking) setIsBuffering(false); };

    video.addEventListener("waiting",        show);
    video.addEventListener("seeking",        show);
    video.addEventListener("playing",        hide);
    video.addEventListener("seeked",         hide);
    video.addEventListener("canplay",        hide);
    video.addEventListener("canplaythrough", hide);
    video.addEventListener("pause",          onPause);

    return () => {
      video.removeEventListener("waiting",        show);
      video.removeEventListener("seeking",        show);
      video.removeEventListener("playing",        hide);
      video.removeEventListener("seeked",         hide);
      video.removeEventListener("canplay",        hide);
      video.removeEventListener("canplaythrough", hide);
      video.removeEventListener("pause",          onPause);
    };
  }, [videoRef]);

  return { isBuffering };
}
