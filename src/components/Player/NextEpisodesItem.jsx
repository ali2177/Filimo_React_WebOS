import React, { useEffect, useState } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";

let jwt = localStorage.getItem("jwt");

const NextEpisodesItem = ({ title, desc, focuskeey, nextUid, currentUid }) => {
  const navigate = useNavigate();
  const location = useLocation("");
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      // console.log("focus");
    },
    onEnterPress: () => {
      console.log(focusKey);
      if (focuskeey === "next-episode") {
        console.log("next");
        localStorage.setItem("movie_uid", nextUid);
        window.location.reload();
      } else if (focuskeey === "back-movie-page") {
        console.log("beck-movie-page");
        localStorage.setItem("lastRoute", location.pathname);
        navigate(`/movie/${currentUid}`);
      } else if (focuskeey === "replay") {
        console.log("replay");
        window.location.reload();
      }
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focuskeey,
  });

  return (
    <div
      ref={ref}
      style={{ marginBottom: "30px", padding: "10px" }}
      className={focused ? "next-episode-focus" : ""}
    >
      <li className="next-episode-item">
        <span>{title}</span>
        {desc && <span>{desc}</span>}
      </li>
    </div>
  );
};

export default NextEpisodesItem;
