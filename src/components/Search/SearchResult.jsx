import React, { useState, useRef, useEffect, useMemo } from "react";
import MovieSearch from "../Movie/MovieSearch.jsx";
import { useNavigate } from "react-router-dom";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const SearchResult = () => {
  const { ref, focusKey, focusSelf, focused } = useFocusable({
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "up", "down", "right"],
  });
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");
  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    setData(JSON.parse(localStorage.getItem("searchResult")));
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    setFocus("movieSearch_0");
    // focusSelf();
  }, []);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      navigate(-1);
    }
  };

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };
  return (
    <FocusContext.Provider value={focusKey}>
      <div className="result">
        {data && (
          <>
            <div className="search-title u700">
              <h1>{data.data[0].link_text}</h1>
              <h1>{localStorage.getItem("searchQuery")}</h1>
            </div>
            <div className="more-movies">
              {data.data[0].movies?.data.map((movieItem, index) => (
                <MovieSearch
                  movie={movieItem}
                  movieFocus={movieFocusSet}
                  focusKeey={`movieSearch_${index}`}
                />
              ))}
            </div>
          </>
        )}
        {data?.data[0].movies.data.length === 0 && <h1>موردی یافت نشد !!</h1>}
      </div>
    </FocusContext.Provider>
  );
};

export default SearchResult;
