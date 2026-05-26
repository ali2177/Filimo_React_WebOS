import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../../context/PlayerContext";
import "./SkipIntroUiButton.css";

const SkipIntroUiButton = () => {
  const { skipIntro } = usePlayerContext();

  const { ref, focused } = useFocusable({
    focusKey: "skip-intro-ui",
    onEnterPress: skipIntro,
  });

  return (
    <div
      ref={ref}
      className={`skip-intro-ui-btn${focused ? " skip-intro-ui-btn-focused" : ""}`}
      onClick={skipIntro}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className={
          focused
            ? "skip-intro-ui-icon skip-intro-ui-icon-focused"
            : "skip-intro-ui-icon"
        }
      >
        <path d="M9.45317 26.6665C9.15288 26.6817 8.85391 26.6173 8.5865 26.4798C6.8265 25.4398 6.6665 18.1065 6.6665 15.8932C6.6665 13.1065 6.85317 6.55984 8.57317 5.5465C10.3065 4.53317 16.0665 7.65317 18.4665 9.03984C20.3998 10.1465 26.6665 13.9065 26.6665 15.9998C26.6665 18.0932 21.0132 21.4932 18.5732 22.8932C16.4532 24.1065 11.7598 26.6665 9.45317 26.6665Z" />
      </svg>

      <span className="u600">رد کردن تیتراژ</span>
    </div>
  );
};

export default SkipIntroUiButton;
