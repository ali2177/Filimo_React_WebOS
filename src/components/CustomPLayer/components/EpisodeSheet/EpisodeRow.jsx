import React, { useRef } from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const EpisodeRow = ({ focusKey: fk, label, isPlaying, onEnter }) => {
  const myRef = useRef(null);
  const { ref, focused } = useFocusable({
    onFocus: () => {
      handleScrolling();
    },
    focusKey: fk,
    onEnterPress: onEnter,
  });
  const handleScrolling = () => {
    setTimeout(() => {
      if (localStorage.getItem("mode") === "KeyboardMode") {
        myRef?.current?.scrollIntoView({
          block: "center",
        });
      }
    }, 10);
  };
  return (
    <div
      ref={ref}
      className={`es-row${focused ? " es-row-focused" : ""}${isPlaying ? " es-row-playing" : ""}`}
      onClick={onEnter}
    >
      <span ref={myRef} className="es-row-badge u400">
        {isPlaying ? "در حال تماشا" : null}
      </span>
      <span className="es-row-label u400">{label}</span>
    </div>
  );
};

export default EpisodeRow;
