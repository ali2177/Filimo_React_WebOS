import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const ToggleRow = ({ focusKey: fk, label, checked, onToggle }) => {
  const { ref, focused } = useFocusable({
    focusKey: fk,
    onEnterPress: onToggle,
  });
  return (
    <div
      ref={ref}
      className={`st-row${focused ? " st-row-focused" : ""}`}
      onClick={onToggle}
    >
      <div className={`st-toggle${checked ? " st-toggle-on" : ""}`}>
        <div className="st-toggle-thumb" />
      </div>
      <div className="st-row-text">
        <span className="st-row-label u400">{label}</span>
        <span className="st-row-sublabel u400">
          {checked ? "روشن" : "خاموش"}
        </span>
      </div>
    </div>
  );
};

export default ToggleRow;
