import React, { useEffect, useState } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";

let jwt = localStorage.getItem("jwt");

const NextEpisodesItem = ({
  title,
  desc,
  nextUid,
  currentUid,
  onCounterFinish,
}) => {
  const navigate = useNavigate();
  const location = useLocation("");
  const [conter, setConter] = useState(0);
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      // console.log("focus");
    },
    onEnterPress: () => {
      localStorage.setItem("movie_uid", nextUid);
      window.location.reload();
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: "next-episode-player__0",
  });

  useEffect(() => {
    let counter = 0;

    const interval = setInterval(() => {
      if (counter < 10) {
        // console.log(counter);
        counter++;
        setConter(counter);
      }
      if (counter === 10) {
        onCounterFinish();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      className={
        focused ? "next-episode-focus nextepisodebtn" : "nextepisodebtn"
      }
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={() => {
        localStorage.setItem("movie_uid", nextUid);
        window.location.reload();
      }}
    >
      <div
        style={{ width: `${conter * 10}%` }}
        className="nextepisodebtn-progress"
      />
      <span style={{ position: "relative", zIndex: "10" }}> قسمت بعدی</span>
    </div>
  );
};

export default NextEpisodesItem;
