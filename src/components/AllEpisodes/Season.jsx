import React, { useEffect, useRef } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const Season = ({ title, count, onEnterPress, focusKeey }) => {
  const myRef = useRef(null);
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onEnterPress: () => {
      onEnterPress();
      localStorage.setItem("lastSeasonFocus", focusKey);
    },
    onFocus: () => {
      handleScrolling();
    },
    onArrowPress: (e) => {
      if (e === "right") {
        setFocus("Episode_0");
      }
    },
    focusKey: focusKeey,
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
  useEffect(() => {
    if (localStorage.getItem("lastSeasonFocus")) {
      setFocus(localStorage.getItem("lastSeasonFocus"));
    } else {
      setFocus("Season_0");
    }
  }, []);
  return (
    <div
      ref={ref}
      className={focused ? "season-focused season u500" : "season u500"}
      onClick={onEnterPress}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
    >
      {title}
      <div ref={myRef}>
        <span>{count}</span>
        <span>قسمت</span>
      </div>
    </div>
  );
};

export default Season;
