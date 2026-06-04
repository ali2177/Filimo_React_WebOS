import { useCallback } from "react";

export function useKeyboardAwareScroll(ref) {
  return useCallback(() => {
    setTimeout(() => {
      if (localStorage.getItem("mode") === "KeyboardMode") {
        ref?.current?.scrollIntoView({ block: "center" });
      }
    }, 10);
  }, [ref]);
}
