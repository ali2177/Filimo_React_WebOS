import React, { useState, useRef, useEffect, useMemo } from "react";
import MovieSearch from "../Movie/MovieSearch.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGetMoreMoviesQuery } from "../../services/TMDB";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const MoreMovieWeb = () => {
  const location = useLocation();
  const { tag_id } = useParams();

  const { data, error, isFetching } = useGetMoreMoviesQuery({ tag_id });
  const { ref, focusKey, focusSelf, focused } = useFocusable({
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "up", "down", "right"],
  });
  const navigate = useNavigate();
  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");
  useEffect(() => {
    localStorage.removeItem("seasonBtn");
    localStorage.removeItem("recommBtn");
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    if (localStorage.getItem("last")) {
      setFocus(localStorage.getItem("last"));
    } else {
      setFocus("movieSearch_0");
    }
    // focusSelf();
  }, []);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      if (location.pathname !== "/player") navigate(-1);
    }
  };

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  if (!isFetching) {
    return (
      <FocusContext.Provider value={focusKey}>
        <div className="result">
          {data && (
            <>
              <div className="search-title u700"></div>
              <div className="more-movies">
                {data.data[1].movies.data.map((movieItem, index) => (
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
  }
};

export default MoreMovieWeb;
