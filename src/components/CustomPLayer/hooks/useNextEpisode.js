import { useEffect, useRef, useState } from "react";

export function useNextEpisode(currentTime, castData) {
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (!castData?.nextPartUid || !castData?.start) return;
    if (currentTime < castData.start) {
      dismissedRef.current = false;
      return;
    }
    if (dismissedRef.current) return;
    setShowNextEpisode(true);
  }, [currentTime, castData]);

  const dismissNextEpisode = () => {
    dismissedRef.current = true;
    setShowNextEpisode(false);
  };

  return { showNextEpisode, dismissNextEpisode };
}
