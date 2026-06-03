import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { CheckIcon } from "../sheetIcons";

const SeasonRow = ({ focusKey: fk, label, isActive, onEnter }) => {
  const { ref, focused } = useFocusable({
    focusKey: fk,
    onEnterPress: onEnter,
  });
  return (
    <div
      ref={ref}
      className={`es-row${focused ? " es-row-focused" : ""}`}
      style={{ backgroundColor: isActive ? "#313131" : "transparent" }}
      onClick={onEnter}
    >
      <span className="es-row-icon u400">{isActive ? CheckIcon : null}</span>
      <span className="es-row-label u400">{label}</span>
    </div>
  );
};

export default SeasonRow;
