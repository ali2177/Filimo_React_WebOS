import { useEffect } from "react";
import { isBackKey } from "../utils/keys";

export function useBackKey(callback, { capture = false, enabled = true } = {}) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      if (!isBackKey(e)) return;
      callback(e);
    };
    window.addEventListener("keydown", handler, capture);
    return () => window.removeEventListener("keydown", handler, capture);
  }, [callback, capture, enabled]);
}
