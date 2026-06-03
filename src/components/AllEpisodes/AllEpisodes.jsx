import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MovieList } from "../index";
import { useGetAllEpisodesQuery } from "../../services/TMDB";
import logo from "../../assets/images/televika_sign.png";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useOnlineStatus } from "../App.jsx";
import { Focusable } from "react-js-spatial-navigation";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import ContentRow from "../ContentRow";
import ContentOnlyRow from "../ContentOnlyRow";
import ContentMoreRow from "../ContentMoreRow.jsx";
import SeasonCount from "./SeasonCount.jsx";
import EpisodesWrapper from "./EpisodesWrapper.jsx";

const AllEpisodes = () => {
  const { setIsSeasonChange, isSeasonChange } = useOnlineStatus();
  const myRef = useRef(null);
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left"],
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { ui_id } = useParams();
  const { data, error, isFetching } = useGetAllEpisodesQuery(ui_id);
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveSeasonFocus, setIsActiveSeasonFocus] = useState(true);
  const [curretSeasonChosen, setCurretSeasonChosen] = useState(null);
  const [curretSeasonDetail, setCurretSeasonDetail] = useState(null);
  const [links, setLinks] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsActiveSeasonFocus(false);
    }, 2000);
    localStorage.removeItem("lastFocusActor");
    localStorage.removeItem("lastFocusCrew");
    window.addEventListener("keydown", keyHandler);
    window.scrollTo({ top: 0 });
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    setCurretSeasonChosen(data?.data[data.data.length - 1]?.movies?.data);
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isActiveSeasonFocus) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isActiveSeasonFocus]);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      if (location.pathname !== "/player") navigate(-1);
    }
  };
  const HandleSeasonEnterPress = (season) => {
    // console.log(season.movies?.data[0]);
    localStorage.setItem(
      "lastSeasonFocus_parent_new",
      season.movies?.data[0].serial_parent_new
    );
    localStorage.setItem(
      "lastSeasonFocus_season_part",
      season.movies?.data[0].serial_season_part
    );
    setIsLoading(true);
    setIsActiveSeasonFocus(true);
    setCurretSeasonChosen(season.movies.data);
    setIsSeasonChange(!isSeasonChange);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setTimeout(() => {
      setIsActiveSeasonFocus(false);
    }, 4000);

    // getUserData(
    //   localStorage.getItem("jwt"),
    //   season.movies.data[0].serial_parent_new,
    //   season.movies.data[0].serial_season_part
    // );
  };
  const onRowFocus = React.useCallback(
    ({ y }) => {
      myRef.current.scrollTo({
        top: y,
      });
      // console.log(ref.current.scrollTop);
      // ref.current.scrollTop += 10;
      // console.log(ref.current.scrollTop);
      // ref.current.style.scrollBehavior = "smooth";
    },
    [ref]
  );

  const movieSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  if (error) return <NetworkError />;

  if (isFetching || isLoading) return <Loader />;

  if (!data.data) return <NetworkError />;

  if (data.data.length === 0)
    return <NetworkError errorText="دیتایی یافت نشد" />;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          paddingTop: "3.5rem",
          paddingRight: "4.2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "94%",
          }}
        >
          <img
            src="https://www.filimo.com/assets/app/filimo/android/nlogo_tv/ic_filimo_banner_v3.webp"
            style={{
              width: "7rem",
              height: "auto",
            }}
          />
          <h1 className="u500">
            {localStorage
              .getItem("seriesName")
              .substring(0, localStorage.getItem("seriesName").indexOf("-"))}
          </h1>
        </div>

        <div
          ref={myRef}
          style={{
            position: "relative",
            overflow: "hidden",
          }}
          className="allepisode-content-wrapper"
        >
          <SeasonCount data={data} onEnterPress={HandleSeasonEnterPress} />
          {!isLoading && (
            <EpisodesWrapper
              data={data}
              links={links}
              curretSeasonChosen={curretSeasonChosen}
              curretSeasonDetail={curretSeasonDetail}
            />
          )}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default AllEpisodes;
