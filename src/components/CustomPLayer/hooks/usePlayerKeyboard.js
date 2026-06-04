import { useEffect, useRef } from "react";
import { isBackKey } from "../utils/utils";

export function usePlayerKeyboard({
  videoRef,
  uiVisible,
  activeModal,
  skipIntroRef,
  resetUiTimer,
  forceHideUi,
  closeModal,
  navigate,
}) {
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    const handleKey = (e) => {
      const now = Date.now();
      if (now - lastKeyTimeRef.current < 100) return;
      lastKeyTimeRef.current = now;

      if (!isBackKey(e)) resetUiTimer();

      const video = videoRef.current;
      if (!video) return;

      if (isBackKey(e)) {
        if (uiVisible) {
          forceHideUi();
          video.play().catch(() => {});
        } else if (activeModal) {
          closeModal();
        } else {
          navigate(-1);
        }
        return;
      }

      switch (e.key) {
        case "Enter":
          if (uiVisible || activeModal) break;
          if (skipIntroRef.current) break; // norigin handles it
          video.paused ? video.play().catch(() => {}) : video.pause();
          resetUiTimer();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [uiVisible, activeModal, skipIntroRef, resetUiTimer, forceHideUi, closeModal, navigate, videoRef]);
}
