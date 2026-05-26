import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import splash from "../../../src/assets/images/aparat-kids-splash.svg";

const Splash = ({ jwtSub, user }) => {
  const location = useLocation("");
  useEffect(() => {
    // console.log("splash shown");
    if (location.pathname !== "/player") {
      localStorage.removeItem("lastdataloaded");
      localStorage.removeItem("lastdataloadedIran");
      localStorage.removeItem("lastdataloadedMovies");
      localStorage.removeItem("lastdataloadedSeries");
      localStorage.removeItem("lastdataloadedKids");
      localStorage.removeItem("moreSingle");
      localStorage.removeItem("lastRoute");
      localStorage.removeItem("lastFocus");
      localStorage.removeItem("lastFocusMoreItem");
      localStorage.removeItem("last");
      localStorage.removeItem("lastFocusRow");
      localStorage.removeItem("lastFocusRowMoviesBeforeReload");
      localStorage.removeItem("lastFocusRowKidsBeforeReload");
      localStorage.removeItem("lastFocusRowIranBeforeReload");
      localStorage.removeItem("lastdataloadedKids");
      localStorage.removeItem("lastFocusRowBeforeReload");
      localStorage.removeItem("lastMovieFocus");
      localStorage.removeItem("lastdataloadedMovies");
      localStorage.removeItem("lastdataloadedSeries");
      localStorage.removeItem("lastSeasonFocus");
      localStorage.removeItem("moreBtn");
      localStorage.removeItem("seasonBtn");
      localStorage.removeItem("recommBtn");
      localStorage.removeItem("movie_cast_time");
      localStorage.removeItem("movie_uid");
      localStorage.removeItem("fromAlert");
      // localStorage.removeItem("lastFocusMenuItem");
      localStorage.removeItem("movie_last_watch_time");
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
