import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useBackKey } from "@src/hooks/useBackKey";
import MovieSearch from "@src/components/Movie/MovieSearch.jsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGetMoreMoviesQuery } from "../../services/TMDB";
import { uiStorage } from "@src/utils/uiStorage";
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
    uiStorage.removeItem("seasonBtn");
    uiStorage.removeItem("recommBtn");
  }, []);
  useEffect(() => {
    if (uiStorage.getItem("last")) {
      setFocus(uiStorage.getItem("last"));
    } else {
      setFocus("movieSearch_0");
    }
    // focusSelf();
  }, []);

  const handleBack = useCallback(() => {
    if (location.pathname !== "/player") navigate(-1);
  }, [location.pathname, navigate]);

  useBackKey(handleBack);

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
