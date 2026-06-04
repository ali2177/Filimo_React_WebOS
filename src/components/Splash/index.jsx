import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import splash from "../../../src/assets/images/aparat-kids-splash.svg";
import { uiStorage } from "@src/utils/uiStorage";

const Splash = ({ jwtSub, user }) => {
  const location = useLocation("");
  useEffect(() => {
    // console.log("splash shown");
    if (location.pathname !== "/player") {
      uiStorage.removeItem("lastdataloaded");
      uiStorage.removeItem("lastdataloadedIran");
      uiStorage.removeItem("lastdataloadedMovies");
      uiStorage.removeItem("lastdataloadedSeries");
      uiStorage.removeItem("lastdataloadedKids");
      uiStorage.removeItem("moreSingle");
      localStorage.removeItem("lastRoute");
      uiStorage.removeItem("lastFocus");
      uiStorage.removeItem("lastFocusMoreItem");
      uiStorage.removeItem("last");
      uiStorage.removeItem("lastFocusRow");
      uiStorage.removeItem("lastFocusRowMoviesBeforeReload");
      uiStorage.removeItem("lastFocusRowKidsBeforeReload");
      uiStorage.removeItem("lastFocusRowIranBeforeReload");
      uiStorage.removeItem("lastdataloadedKids");
      uiStorage.removeItem("lastFocusRowBeforeReload");
      uiStorage.removeItem("lastMovieFocus");
      uiStorage.removeItem("lastdataloadedMovies");
      uiStorage.removeItem("lastdataloadedSeries");
      uiStorage.removeItem("lastSeasonFocus");
      uiStorage.removeItem("moreBtn");
      uiStorage.removeItem("seasonBtn");
      uiStorage.removeItem("recommBtn");
      uiStorage.removeItem("movie_cast_time");
      uiStorage.removeItem("movie_uid");
      uiStorage.removeItem("fromAlert");
      // uiStorage.removeItem("lastFocusMenuItem");
      uiStorage.removeItem("movie_last_watch_time");
    }
  }, []);
  let x;
  return (
    <div className="splash">
      <img
        style={{ width: "26%", height: "17%" }}
        src="https://www.filimo.com/assets/app/filimo/android/nlogo_tv/ic_splash_logo_v2.webp"
        alt=""
      />
    </div>
  );
};

export default Splash;
