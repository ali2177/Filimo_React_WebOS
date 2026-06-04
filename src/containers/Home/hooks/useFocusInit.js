import { useRef, useCallback, useEffect } from "react";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { uiStorage } from "@src/utils/uiStorage";

export function useFocusInit({ movies, data, pageConfig, pageType, other_data, location }) {
  const scrollRef = useRef(null);
  const didInitFocusRef = useRef(false);

  const onRowFocus = useCallback(({ y }) => {
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

    setFocus("MOVIE_0__0");
  }, [data, movies, pageConfig, pageType]);

  return { scrollRef, onRowFocus };
}
