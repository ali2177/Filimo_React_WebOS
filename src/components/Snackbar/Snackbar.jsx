import React, { useCallback, useEffect } from "react";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import ModalBtn from "./ModalBtn";

const Snackbar = ({ onExit }) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });
  const exitAppLG = useCallback(() => {
    try {
      const app =
        window.webOS?.applicationManager?.getOwnerApplication?.(document);
      if (app?.close) {
        localStorage.removeItem("lastdataloaded");
        localStorage.removeItem("lastFocus");
        app.close();
        return true;
      }
    } catch (e) {}

    return false;
  }, []);
  const exit = () => {
    localStorage.removeItem("lastdataloaded");
    localStorage.removeItem("lastFocus");
    if (!exitAppLG()) {
      window.close?.();
    }
  };
  useEffect(() => {
    // focusSelf();
    // alternatively
    setTimeout(() => {
      setFocus("modal-yes-btn");
    }, [10]);
  }, []);
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="snackbar-wrapper">
        <div className="snackbar u700">آیا می‌خواهید از فیلیمو خارج شوید؟</div>
        <div ref={ref} className="modal-btn-wrapper">
          <ModalBtn focuskeey="modal-yes-btn" text="بله" onClick={exit} />
          <ModalBtn focuskeey="modal-no-btn" text="خیر" onClick={onExit} />
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default Snackbar;
