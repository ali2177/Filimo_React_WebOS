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
      className={`es-row es-nav-row${focused ? " es-row-focused" : ""}`}
      style={{ backgroundColor: "#313131" }}
      onClick={onEnter}
    >
      <span className="es-row-icon">{ChevronLeftIcon}</span>
      <div className="es-row-text">
        <span className="es-row-label u400">{label}</span>
        <span className="es-row-sublabel u400">{subLabel}</span>
      </div>
    </div>
  );
};

export default NavRow;
