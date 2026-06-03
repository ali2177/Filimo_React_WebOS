import { useState, useRef, useCallback, useEffect } from "react";
import {
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { STORAGE_KEYS_TO_CLEAR_ON_ENTER } from "../homeUtils";

export function useBackNavigation({ location, navigate }) {
  const [showExitModal, setShowExitModal] = useState(false);
  const backArmedRef = useRef(false);
  const backTimerRef = useRef(null);

  const isBackKey = useCallback((e) => {
    return e.keyCode === 461 || e.keyCode === 8 || e.keyCode === 10009;
  }, []);

  const armBack = useCallback(() => {
    backArmedRef.current = true;
    clearTimeout(backTimerRef.current);
    setShowExitModal(true);
  }, []);

  const keyHandler = useCallback(
    (e) => {
      if (!isBackKey(e)) return;

      e.preventDefault?.();
      e.stopPropagation?.();

      if (location.pathname === "/") {
        const currentFocusKey = getCurrentFocusKey?.() || "";

        if (!currentFocusKey.includes("menuItem_")) {
          if (!showExitModal) {
            setFocus("menuItem__0");
            return;
          }
        }

        if (!backArmedRef.current) {
          armBack();
          return;
        }

        window.close();
        return;
      }

      if (location.pathname !== "/player") {
        navigate(-1);
      }
    },
    [armBack, isBackKey, location.pathname, navigate, showExitModal],
  );

  useEffect(() => {
    STORAGE_KEYS_TO_CLEAR_ON_ENTER.forEach((key) => {
      localStorage.removeItem(key);
    });

    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, [keyHandler, location.pathname]);

  useEffect(() => {
    return () => {
      clearTimeout(backTimerRef.current);
    };
  }, []);

  return { showExitModal, setShowExitModal, backArmedRef };
}
