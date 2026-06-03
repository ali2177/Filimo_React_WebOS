import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { ChevronLeftIcon } from "../sheetIcons";

const NavRow = ({ focusKey: fk, label, subLabel, onEnter }) => {
  const { ref, focused } = useFocusable({
    focusKey: fk,
    onEnterPress: onEnter,
  });
  return (
    <div
      ref={ref}
      className={`st-row st-nav-row${focused ? " st-row-focused" : ""}`}
      style={{ backgroundColor: "#313131" }}
      onClick={onEnter}
    >
      <span className="st-row-icon">{ChevronLeftIcon}</span>
      <div className="st-row-text">
        <span className="st-row-label u400">{label}</span>
        {subLabel && <span className="st-row-sublabel u400">{subLabel}</span>}
      </div>
    </div>
  );
};

export default NavRow;
