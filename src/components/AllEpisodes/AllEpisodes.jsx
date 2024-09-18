import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MovieList } from "../index";
import { useGetAllEpisodesQuery } from "../../services/TMDB";
import logo from "../../assets/images/televika_type.png";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { Focusable } from "react-js-spatial-navigation";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import ContentRow from "../ContentRow";
import ContentOnlyRow from "../ContentOnlyRow";
import ContentMoreRow from "../ContentMoreRow.jsx";
import SeasonCount from "./SeasonCount.jsx";
import EpisodesWrapper from "./EpisodesWrapper.jsx";

const AllEpisodes = () => {
  const myRef = useRef(null);
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left"],
  });
  const navigate = useNavigate();
  const { ui_id } = useParams();
  const { data, error, isFetching } = useGetAllEpisodesQuery(ui_id);
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [curretSeasonChosen, setCurretSeasonChosen] = useState(null);
  const [curretSeasonDetail, setCurretSeasonDetail] = useState(null);

  useEffect(() => {
    localStorage.removeItem("lastFocusActor");
    localStorage.removeItem("lastFocusCrew");
    window.addEventListener("keydown", keyHandler);
    window.scrollTo({ top: 0 });
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    setCurretSeasonChosen(data?.data[data.data.length - 1]?.movies?.data);
    if (localStorage.getItem("lastSeasonFocus_parent_new")) {
      getUserData(
        localStorage.getItem("jwt"),
        localStorage.getItem("lastSeasonFocus_parent_new"),
        localStorage.getItem("lastSeasonFocus_season_part")
      );
    } else {
      getUserData(
        localStorage.getItem("jwt"),
        data?.data[data.data.length - 1].movies?.data[0].serial_parent_new,
        data?.data[data.data.length - 1].movies?.data[0].serial_season_part
      );
    }
  }, [data]);

  const getUserData = async (jwt, parent_id, part) => {
    try {
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/movie/serial/episodebyseason/parent_id/${parent_id}/part/${part}?json_type=simple`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const blocks = await res?.json();
      console.log(blocks.data[0]);
      if (blocks) {
        setCurretSeasonDetail(blocks.data[0]);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      // navigate(localStorage.getItem("lastRouteNotplayer"));
      navigate(-1);
    }
  };
  const HandleSeasonEnterPress = (season) => {
    console.log(season.movies?.data[0]);
    localStorage.setItem("lastSeasonFocus", season.title);
    localStorage.setItem(
      "lastSeasonFocus_parent_new",
      season.movies?.data[0].serial_parent_new
    );
    localStorage.setItem(
      "lastSeasonFocus_season_part",
      season.movies?.data[0].serial_season_part
    );
    setIsLoading(true);
    setCurretSeasonChosen(season.movies.data);
    getUserData(
      localStorage.getItem("jwt"),
      season.movies.data[0].serial_parent_new,
      season.movies.data[0].serial_season_part
    );
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

  if (isFetching) return <Loader />;

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
          paddingTop: "65px",
          paddingRight: "80px",
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
          <img src={logo} className="logo-expended" />
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
        >
          <SeasonCount data={data} onEnterPress={HandleSeasonEnterPress} />
          {isLoading && <Loader />}
          <EpisodesWrapper
            curretSeasonChosen={curretSeasonChosen}
            curretSeasonDetail={curretSeasonDetail}
          />
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default AllEpisodes;
