import React, { useEffect, useState } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";

let jwt = localStorage.getItem("jwt");

const NextEpisodesExit = ({ onEnterPress, desc, nextUid, currentUid }) => {
  const navigate = useNavigate();
  const location = useLocation("");
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      // console.log("focus");
    },
    onEnterPress,
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: "next-episode-player__1",
  });

  return (
    <div
      ref={ref}
      className={focused ? "next-episode-focus exitbtn" : "exitbtn"}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={onEnterPress}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M14.9994 14.9999L9 8.99988M9.00064 14.9999L15 8.99988M22 11.9999C22 6.47703 17.5228 1.99988 12 1.99988C6.47715 1.99988 2 6.47703 2 11.9999C2 17.5227 6.47715 21.9999 12 21.9999C17.5228 21.9999 22 17.5227 22 11.9999Z"
          stroke="#FAFAFA"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
};

export default NextEpisodesExit;
