import { useCallback } from "react";
import { uiStorage } from "@src/utils/uiStorage";

/* Nearest vertically-scrollable ancestor element (not the document root). */
function getScrollableParent(node) {
  let el = node?.parentElement;
  while (el && el !== document.body && el !== document.documentElement) {
    const overflowY = getComputedStyle(el).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight
    ) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function useKeyboardAwareScroll(ref) {
  return useCallback(() => {
    setTimeout(() => {
      if (uiStorage.getItem("mode") !== "KeyboardMode") return;
      const node = ref?.current;
      if (!node) return;

      const container = getScrollableParent(node);
      if (container) {
        // Center the element within its nearest scroll container only, so the
        // scroll does not chain up to outer scroll containers (e.g. the movie
        // detail page's .hero-scroll-content, which must stay pinned).
        const cRect = container.getBoundingClientRect();
        const nRect = node.getBoundingClientRect();
        const delta =
          nRect.top - cRect.top - (container.clientHeight - nRect.height) / 2;
        container.scrollTo({ top: container.scrollTop + delta });
      } else {
        // No element scroll container (window/body scroll): original behavior.
        node.scrollIntoView({ block: "center" });
      }
    }, 10);
  }, [ref]);
}
