import React, { useState, useRef, useEffect, useMemo } from "react";
import MovieSearch from "../Movie/MovieSearch.jsx";
import NetworkError from "../NetworkError/NetworkError.jsx";
import Loader from "../Loader/Loader.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import {
  useGetMovieQuery,
  useGetMovieDetailQuery,
  useGetMovieRecomQuery,
} from "../../services/TMDB";

const MoreSingle = () => {
  const { title, id } = useParams();
  const { ref, focusKey, focusSelf, focused } = useFocusable({
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "up", "down", "right"],
  });
  const {
    data: movieDetail,
    error: movieDetailError,
    isFetching: detailIsFetching,
  } = useGetMovieRecomQuery({ id });
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation("");
  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");
  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
    if (id) {
      setData(movieDetail?.data[0].movies?.data);
    } else {
      setData(JSON.parse(localStorage.getItem("moreSingle")));
    }
  }, [movieDetail]);
  useEffect(() => {
    setFocus("movieSearch_0");

    // focusSelf();
  }, []);
  useEffect(() => {
    localStorage.removeItem("seasonBtn");
    // localStorage.removeItem("recommBtn");
    localStorage.removeItem("lastSeasonFocus");
  }, [location]);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      // localStorage.removeItem("moreSingle");
      navigate(-1);
    }
  };

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  if (detailIsFetching) return <Loader />;
  if (!data) return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        style={{
          paddingRight: "70px",
          paddingTop: "100px",
          background:
            "linear-gradient(270deg, #151515 0%, rgba(17, 17, 17, 0.75) 50.79%, rgba(12, 12, 12, 0) 100%), linear-gradient(180deg, rgba(21, 21, 21, 0) 67.35%, #151515 100%)",
        }}
        className="result"
      >
        {title !== "undefined" && <h1 className="u700">{title}</h1>}

        {data && (
          <>
            <div className="more-movies">
              {data.map((movieItem, index) => (
                <MovieSearch
                  movie={movieItem}
                  movieFocus={movieFocusSet}
                  focusKeey={`movieSearch_${index}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default MoreSingle;
