import React, { useEffect, useRef } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { toFarsiDigits } from "@src/components/CustomPLayer/utils/toFarsiDigits";
import { uiStorage } from "@src/utils/uiStorage";

const SeasonCheckIcon = () => (
  <svg
    className="season-check-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M16.0001 2.6665C13.363 2.6665 10.7851 3.44849 8.59248 4.91358C6.39983 6.37866 4.69086 8.46104 3.68169 10.8974C2.67253 13.3337 2.40848 16.0146 2.92295 18.601C3.43742 21.1875 4.7073 23.5632 6.572 25.4279C8.4367 27.2926 10.8125 28.5625 13.3989 29.077C15.9853 29.5914 18.6662 29.3274 21.1025 28.3182C23.5389 27.3091 25.6213 25.6001 27.0863 23.4074C28.5514 21.2148 29.3334 18.6369 29.3334 15.9998C29.3334 14.2489 28.9885 12.5151 28.3185 10.8974C27.6484 9.27972 26.6663 7.80986 25.4282 6.57175C24.1901 5.33363 22.7202 4.35151 21.1025 3.68144C19.4849 3.01138 17.751 2.6665 16.0001 2.6665V2.6665ZM23.6134 13.3332L14.9468 21.9998C14.8228 22.1248 14.6753 22.224 14.5129 22.2917C14.3504 22.3594 14.1761 22.3942 14.0001 22.3942C13.8241 22.3942 13.6498 22.3594 13.4873 22.2917C13.3248 22.224 13.1774 22.1248 13.0534 21.9998L8.38675 17.3332C8.13568 17.0821 7.99463 16.7416 7.99463 16.3865C7.99463 16.0314 8.13568 15.6909 8.38675 15.4398C8.63783 15.1888 8.97835 15.0477 9.33342 15.0477C9.68849 15.0477 10.029 15.1888 10.2801 15.4398L14.0001 19.1732L21.7201 11.4398C21.9712 11.1888 22.3117 11.0477 22.6668 11.0477C23.0218 11.0477 23.3623 11.1888 23.6134 11.4398C23.8645 11.6909 24.0055 12.0314 24.0055 12.3865C24.0055 12.7416 23.8645 13.0821 23.6134 13.3332V13.3332Z"
      fill="white"
    />
  </svg>
);
const SeasonCheckIconBlack = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M16 2.66699C13.3629 2.66699 10.785 3.44898 8.59239 4.91406C6.39974 6.37915 4.69077 8.46153 3.6816 10.8979C2.67243 13.3342 2.40839 16.0151 2.92286 18.6015C3.43733 21.1879 4.70721 23.5637 6.57191 25.4284C8.43661 27.2931 10.8124 28.563 13.3988 29.0775C15.9852 29.5919 18.6661 29.3279 21.1024 28.3187C23.5388 27.3096 25.6212 25.6006 27.0863 23.4079C28.5513 21.2153 29.3333 18.6374 29.3333 16.0003C29.3333 14.2494 28.9885 12.5156 28.3184 10.8979C27.6483 9.2802 26.6662 7.81035 25.4281 6.57223C24.19 5.33412 22.7201 4.35199 21.1024 3.68193C19.4848 3.01187 17.751 2.66699 16 2.66699V2.66699ZM23.6133 13.3337L14.9467 22.0003C14.8227 22.1253 14.6752 22.2245 14.5128 22.2922C14.3503 22.3599 14.176 22.3947 14 22.3947C13.824 22.3947 13.6497 22.3599 13.4872 22.2922C13.3247 22.2245 13.1773 22.1253 13.0533 22.0003L8.38666 17.3337C8.13559 17.0826 7.99454 16.7421 7.99454 16.387C7.99454 16.0319 8.13559 15.6914 8.38666 15.4403C8.63773 15.1893 8.97826 15.0482 9.33333 15.0482C9.6884 15.0482 10.0289 15.1893 10.28 15.4403L14 19.1737L21.72 11.4403C21.9711 11.1893 22.3116 11.0482 22.6667 11.0482C23.0217 11.0482 23.3623 11.1893 23.6133 11.4403C23.8644 11.6914 24.0055 12.0319 24.0055 12.387C24.0055 12.7421 23.8644 13.0826 23.6133 13.3337V13.3337Z"
      fill="#151515"
    />
  </svg>
);

const Season = ({
  title,
  count,
  onEnterPress,
  focusKeey,
  autoFocus = true,
  isFirst = false,
  isActive = false,
  onExitUp,
}) => {
  const myRef = useRef(null);
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onEnterPress: () => {
      onEnterPress();
      uiStorage.setItem("lastSeasonFocus", focusKey);
    },
    onFocus: () => {
      handleScrolling();
    },
    onArrowPress: (e) => {
      if (e === "right") {
        setFocus("Episode_0");
        return false;
      }
      if (e === "up" && isFirst) {
        onExitUp?.();
        return false;
      }
      return true;
    },
    focusKey: focusKeey,
  });

  // Center the focused season within the `.season-count` list only. Using
  // scrollIntoView here would chain the scroll up to the movie detail page's
  // `.hero-scroll-content` whenever the season list is short enough not to
  // overflow, dragging the whole page down. Scoping to `.season-count` (and
  // letting scrollTo clamp) keeps the hero pinned.
  const handleScrolling = () => {
    setTimeout(() => {
      if (uiStorage.getItem("mode") !== "KeyboardMode") return;
      const item = ref.current;
      const container = item?.closest(".season-count");
      if (!item || !container) return;
      const cRect = container.getBoundingClientRect();
      const nRect = item.getBoundingClientRect();
      const delta =
        nRect.top - cRect.top - (container.clientHeight - nRect.height) / 2;
      container.scrollTo({ top: container.scrollTop + delta });
    }, 10);
  };
  useEffect(() => {
    if (!autoFocus) return;
    const saved = uiStorage.getItem("lastSeasonFocus");
    if (saved) {
      setFocus(saved);
    } else {
      setFocus("Season_0");
    }
  }, [autoFocus]);
  return (
    <div
      ref={ref}
      className={focused ? "season-focused season u500" : "season u500"}
      onClick={onEnterPress}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
    >
      <div className="season-title u700">
        {isActive && !focused && <SeasonCheckIcon />}
        {isActive && focused && <SeasonCheckIconBlack />}
        {title}
      </div>
      <div ref={myRef}>
        <span style={{ marginLeft: "0.2rem" }} className="u400">
          {toFarsiDigits(count)}
        </span>
        <span className="u400">قسمت</span>
      </div>
    </div>
  );
};

export default Season;
