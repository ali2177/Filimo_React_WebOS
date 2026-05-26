import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import NetworkError from "../../NetworkError/NetworkError.jsx";
import Loader from "../../Loader/Loader.jsx";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

import {
  useGetMovieQuery,
  useGetMovieDetailQuery,
  useGetMovieRecomQuery,
} from "../../../services/TMDB";
import Actors from "../../Actors/Actors";
import Crews from "../../Crews/Crews";
import { stripHtmlTags } from "../../../utils";

const MoreDetail = () => {
  const location = useLocation();
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "up", "right", "down"],
  });
  const { id } = useParams();
  const {
    data: movieDetail,
    error: movieDetailError,
    isFetching: detailIsFetching,
  } = useGetMovieDetailQuery({ id });

  const navigate = useNavigate();

  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    window.scrollTo({ top: 0 });
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  // useEffect(() => {
  //   console.log(focusKey);
  //   focusSelf();
  // }, []);
  // useEffect(() => {
  //   focusSelf();
  // }, [location]);
  useEffect(() => {
    if (movieDetail?.data?.ActorCrewData) {
      setFocus("Actor__0");
    } else {
      setFocus("Crew__0");
    }
  }, [movieDetail]);

  //   const onRowFocus = React.useCallback(
  //     ({ y }) => {
  //       if (event) {
  //         if (event.key === "ArrowDown") {
  //           ref.current.scrollTop += 300;
  //         } else if (event.key === "ArrowUp") {
  //           ref.current.scrollTop -= 300;
  //         }
  //       }

  //       ref.current.scrollTo({
  //         top: y,
  //         behavior: "smooth",
  //       });
  //       console.log(ref.current.scrollTop);
  //       ref.current.scrollTop += 10;
  //       console.log(ref.current.scrollTop);
  //       ref.current.style.scrollBehavior = "smooth";
  //     },
  //     [ref]
  //   );

  //   const movieFocusSet = (movieUid) => {
  //     setCurretFocusedMovie(movieUid);
  //   };

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      if (location.pathname !== "/player") navigate(-1);
    }
  };

  if (detailIsFetching) return <Loader />;

  if (movieDetailError) return <NetworkError errorText="دیتایی یافت نشد" />;

  if (!movieDetail?.data?.ActorCrewData && !movieDetail?.data?.OtherCrewData)
    return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          background:
            "linear-gradient(270deg, #151515 0%, rgba(17, 17, 17, 0.75) 50.79%, rgba(12, 12, 12, 0) 100%), linear-gradient(180deg, rgba(21, 21, 21, 0) 67.35%, #151515 100%)",
        }}
      >
        {!detailIsFetching && movieDetail?.data?.ActorCrewData && (
          <Actors actorsRow={movieDetail?.data?.ActorCrewData?.profile} />
        )}

        {/* <section style={{ marginRight: "2.1rem" }} className="movie-description">
        <h3 className="movie-description-header u700">داستان</h3>
        <p className="movie-description-text u500">
          {stripHtmlTags(movieData?.data?.General.about_movie)}
        </p>
      </section> */}

        {!detailIsFetching && movieDetail?.data?.OtherCrewData && (
          <Crews crewRow={movieDetail?.data?.OtherCrewData} />
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default MoreDetail;
