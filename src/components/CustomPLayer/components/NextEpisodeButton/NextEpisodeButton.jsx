import React, { useCallback, useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { isBackKey } from "../../utils/utils";
import "./NextEpisodeButton.css";

const NextEpisodeButton = ({
  castData,
  autoPlayNext,
  onDismiss,
  onNextEpisode,
}) => {
  const goToNext = useCallback(() => {
    onNextEpisode(castData.nextPartUid);
  }, [castData.nextPartUid, onNextEpisode]);

  const { ref: btnRef, focused: btnFocused } = useFocusable({
    focusKey: "next-episode-btn",
    onEnterPress: goToNext,
  });

  const { ref: dismissRef, focused: dismissFocused } = useFocusable({
    focusKey: "next-episode-dismiss",
    onEnterPress: onDismiss,
  });

  useEffect(() => {
    setFocus("next-episode-btn");
    if (!autoPlayNext) return;
    const timer = setTimeout(goToNext, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Trap all navigation inside this overlay — block UI from appearing
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.stopImmediatePropagation();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.stopImmediatePropagation();
        setFocus("next-episode-dismiss");
        return;
      }
      if (e.key === "ArrowRight") {
        e.stopImmediatePropagation();
        setFocus("next-episode-btn");
        return;
      }
      if (isBackKey(e)) {
        e.stopImmediatePropagation();
        onDismiss();
        return;
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [onDismiss]);

  return (
    <div className="next-episode-wrapper">
      <div
        ref={btnRef}
        className={`next-episode-btn${btnFocused ? " next-episode-btn-focused" : ""}`}
        onClick={goToNext}
      >
        {autoPlayNext && <div className="next-episode-fill" />}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className={
            btnFocused
              ? "next-episode-icon next-episode-icon-focused"
              : "next-episode-icon"
          }
        >
          <path d="M25.5869 5.33203C25.9405 5.33203 26.2802 5.47261 26.5303 5.72266C26.7803 5.9727 26.9209 6.31243 26.9209 6.66602V25.332C26.9209 25.6856 26.7803 26.0253 26.5303 26.2754C26.2802 26.5254 25.9405 26.666 25.5869 26.666C25.2335 26.666 24.8945 26.5252 24.6445 26.2754C24.3945 26.0253 24.2539 25.6857 24.2539 25.332V6.66602C24.2539 6.31239 24.3945 5.9727 24.6445 5.72266C24.8945 5.4728 25.2335 5.33208 25.5869 5.33203ZM9.1211 5.76172C9.72793 5.79831 10.3131 6.00043 10.8135 6.3457L20.8008 13.252C21.2454 13.5588 21.6085 13.9698 21.8594 14.4482C22.1102 14.9267 22.2408 15.4589 22.2402 15.999C22.242 16.5376 22.1114 17.0684 21.8604 17.5449C21.6093 18.0213 21.2459 18.4294 20.8008 18.7324L10.8135 25.6523C10.2563 26.0344 9.59653 26.2393 8.9209 26.2393C8.38302 26.2394 7.85261 26.1107 7.37402 25.8652C6.83498 25.5812 6.38322 25.1554 6.06836 24.6338C5.75368 24.1123 5.58707 23.5144 5.58692 22.9053V9.09277C5.58632 8.48476 5.75231 7.88779 6.06641 7.36719C6.38064 6.84651 6.83177 6.42158 7.37012 6.13867C7.90843 5.85582 8.51409 5.72519 9.1211 5.76172Z" />
        </svg>
        <span className="u600">تماشای قسمت بعد</span>
      </div>
      <div
        ref={dismissRef}
        className={`next-episode-dismiss${dismissFocused ? " next-episode-dismiss-focused" : ""}`}
        onClick={onDismiss}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className={
            btnFocused
              ? "next-episode-icon next-episode-icon-focused"
              : "next-episode-icon"
          }
        >
          <path d="M17.6453 15.9944L24.9908 8.66065C25.2103 8.4411 25.3337 8.14332 25.3337 7.83283C25.3337 7.52233 25.2103 7.22456 24.9908 7.005C24.7712 6.78545 24.4734 6.66211 24.1629 6.66211C23.8524 6.66211 23.5547 6.78545 23.3351 7.005L16.0013 14.3505L8.66752 7.005C8.44797 6.78545 8.15019 6.66211 7.8397 6.66211C7.52921 6.66211 7.23143 6.78545 7.01188 7.005C6.79233 7.22456 6.66898 7.52233 6.66898 7.83283C6.66898 8.14332 6.79233 8.4411 7.01188 8.66065L14.3573 15.9944L7.01188 23.3282C6.90259 23.4366 6.81586 23.5656 6.75666 23.7077C6.69747 23.8498 6.66699 24.0022 6.66699 24.1561C6.66699 24.31 6.69747 24.4624 6.75666 24.6045C6.81586 24.7465 6.90259 24.8755 7.01188 24.9839C7.12027 25.0932 7.24922 25.1799 7.3913 25.2391C7.53338 25.2983 7.68578 25.3288 7.8397 25.3288C7.99362 25.3288 8.14601 25.2983 8.28809 25.2391C8.43018 25.1799 8.55913 25.0932 8.66752 24.9839L16.0013 17.6384L23.3351 24.9839C23.4435 25.0932 23.5725 25.1799 23.7145 25.2391C23.8566 25.2983 24.009 25.3288 24.1629 25.3288C24.3169 25.3288 24.4693 25.2983 24.6113 25.2391C24.7534 25.1799 24.8824 25.0932 24.9908 24.9839C25.1 24.8755 25.1868 24.7465 25.246 24.6045C25.3052 24.4624 25.3356 24.31 25.3356 24.1561C25.3356 24.0022 25.3052 23.8498 25.246 23.7077C25.1868 23.5656 25.1 23.4366 24.9908 23.3282L17.6453 15.9944Z" />
        </svg>
      </div>
    </div>
  );
};

export default NextEpisodeButton;
