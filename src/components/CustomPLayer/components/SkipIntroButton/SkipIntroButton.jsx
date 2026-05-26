import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import "./SkipIntroButton.css";

const SkipIntroButton = ({ onSkip }) => {
  const { ref, focused } = useFocusable({
    focusKey: "skip-intro",
    onEnterPress: onSkip,
  });

  return (
    <div
      ref={ref}
      className={`skip-intro-btn${focused ? " skip-intro-btn-focused" : ""}`}
      onClick={onSkip}
    >
      <span className="skip-intro-icon">&#9654;</span>
      <span className="u600">رد کردن تیتراژ</span>
    </div>
  );
};

export default SkipIntroButton;
