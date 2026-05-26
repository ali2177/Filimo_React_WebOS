import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { toFarsiDigits } from "../../utils/toFarsiDigits.js";
import { CheckIcon } from "../sheetIcons";

const SelectRow = ({ focusKey: fk, label, subLabel, isActive, onEnter }) => {
  const { ref, focused } = useFocusable({
    focusKey: fk,
    onEnterPress: onEnter,
  });
  return (
    <div
      ref={ref}
      className={`st-row${focused ? " st-row-focused" : ""}`}
      style={{ backgroundColor: isActive ? "#313131" : "transparent" }}
      onClick={onEnter}
    >
      <span className="st-row-icon">{isActive ? CheckIcon : null}</span>
      <div className="st-row-text">
        <span className="st-row-label u400">{toFarsiDigits(label)}</span>
        {subLabel && <span className="st-row-sublabel u400">{subLabel}</span>}
      </div>
    </div>
  );
};

export default SelectRow;
