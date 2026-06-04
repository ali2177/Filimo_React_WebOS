import { useCallback } from "react";
import { uiStorage } from "@src/utils/uiStorage";

export function useKeyboardAwareScroll(ref) {
  return useCallback(() => {
    setTimeout(() => {
      if (uiStorage.getItem("mode") === "KeyboardMode") {
        ref?.current?.scrollIntoView({ block: "center" });
      }
    }, 10);
  }, [ref]);
}
