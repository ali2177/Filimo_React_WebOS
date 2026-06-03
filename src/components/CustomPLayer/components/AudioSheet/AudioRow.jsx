import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { CheckIcon } from "../sheetIcons";

const AudioRow = ({ focusKey: fk, label, isActive, onEnter }) => {
  const { ref, focused } = useFocusable({ focusKey: fk, onEnterPress: onEnter });
  return (
    <div
      ref={ref}
      className={`as-row${focused ? " as-row-focused" : ""}${isActive ? " as-row-active" : ""}`}
      style={{ backgroundColor: isActive ? "#313131" : "transparent" }}
      onClick={onEnter}
    >
      <span className="as-row-icon">{isActive ? CheckIcon : null}</span>
      <span className="as-row-label">{label}</span>
    </div>
  );
};

export default AudioRow;
