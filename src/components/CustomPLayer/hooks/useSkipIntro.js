import { useEffect, useRef, useState } from "react";

export function useSkipIntro(currentTime, introStart, introEnd, videoRef) {
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const skipIntroRef = useRef(false);
  const introEndRef  = useRef(introEnd);

  useEffect(() => { introEndRef.current = introEnd; }, [introEnd]);

  useEffect(() => {
    if (!introStart || !introEnd) return;
    const inRange = currentTime >= introStart && currentTime <= introEnd;
    skipIntroRef.current = inRange; // keep ref synchronous with state
    setShowSkipIntro(inRange);
  }, [currentTime, introStart, introEnd]);

  const skipIntro = () => {
    const v = videoRef.current;
    if (!v) return;
    skipIntroRef.current = false;
    setShowSkipIntro(false);
    v.currentTime = introEndRef.current;
    // Wait for seek to finish before playing to avoid AbortError
    v.addEventListener("seeked", function onSeeked() {
      v.removeEventListener("seeked", onSeeked);
      if (v.paused) v.play().catch(() => {});
    });
  };

  return { showSkipIntro, skipIntroRef, skipIntro };
}
