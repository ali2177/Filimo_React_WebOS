import React, { useEffect } from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const SheetRow = ({
  focusKey: fk,
  label,
  subLabel,
  leftIcon,
  onEnter,
  onLeft,
  onRight,
  onUp,
  onDown,
  onFocus,
}) => {
  const { ref, focused } = useFocusable({
    focusKey: fk,
    onEnterPress: onEnter,
    onArrowPress: (dir) => {
      if (dir === "left") { if (onLeft) onLeft(); return false; }
      if (dir === "right") { if (onRight) onRight(); return false; }
    },
  });

  useEffect(() => {
    if (focused && onFocus) onFocus();
  }, [focused]);

  return (
    <div
      ref={ref}
      className={`ss-row${focused ? " ss-row-focused" : ""}`}
      style={{ backgroundColor: leftIcon ? "#313131" : "none" }}
    >
      <span className="ss-row-icon">{leftIcon}</span>
      <div className="ss-row-text">
        <span className="ss-row-label u400">{label}</span>
        {subLabel && (
          <span
            className={`ss-row-sublabel${focused ? " ss-row-sublabel-focused" : ""} u400`}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default SheetRow;
