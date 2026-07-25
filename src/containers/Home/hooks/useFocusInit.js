import { useRef, useCallback, useEffect } from "react";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { uiStorage } from "@src/utils/uiStorage";

export function useFocusInit({ movies, data, pageConfig, pageType, other_data, location, hasSlider }) {
  const scrollRef = useRef(null);
  const didInitFocusRef = useRef(false);

  const onRowFocus = useCallback(({ y }) => {
    // In PointerMode the mouse wheel drives scrolling. norigin reports the
    // row's offset relative to its single-row wrapper (~0), so scrolling to
    // `y` here yanks the page back to the first row on every hover/focus.
    // Only assist scrolling for keyboard/remote navigation.
    if (uiStorage.getItem("mode") !== "KeyboardMode") return;
    scrollRef.current?.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  useEffect(() => {
    didInitFocusRef.current = false;
  }, [location.pathname, other_data]);

  useEffect(() => {
    if (!movies?.data?.length) return;
    if (didInitFocusRef.current) return;

    didInitFocusRef.current = true;

    const lastFocus = uiStorage.getItem("lastFocus");
    if (lastFocus) {
      setFocus(lastFocus);
      return;
    }

    if (pageConfig?.focusRowBeforeReloadKey) {
      const savedRow = uiStorage.getItem(pageConfig.focusRowBeforeReloadKey);
      if (savedRow) {
        setFocus(`${savedRow}__0`);
        return;
      }
    }

    if (pageType === "series") {
      const lastMovieFocus = uiStorage.getItem("lastMovieFocus");
      if (lastMovieFocus) {
        setFocus(lastMovieFocus);
        return;
      }
    }

    if (hasSlider) {
      setFocus("SLIDER_PLAY");
      return;
    }

    setFocus("MOVIE_0__0");
  }, [data, movies, pageConfig, pageType, hasSlider]);

  return { scrollRef, onRowFocus };
}
