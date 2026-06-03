import React, { useState, useRef, useEffect, useMemo } from "react";
import MovieSearch from "../Movie/MovieSearch.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import Loader from "../Loader/Loader";

const SearchResult = () => {
  const { ref, focusKey, focusSelf, focused } = useFocusable({
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "up", "down", "right"],
  });
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");
  useEffect(() => {
    localStorage.removeItem("seasonBtn");
    localStorage.removeItem("recommBtn");
    window.addEventListener("keydown", keyHandler);
    setData(JSON.parse(localStorage.getItem("searchResult")));
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoading) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isLoading]);

  useEffect(() => {
    setFocus("movieSearch_0");
    // focusSelf();
  }, []);
  useEffect(() => {
    if (data) {
      // console.log(data);
      setIsloading(false);
    }
  }, [data]);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      if (location.pathname !== "/player") navigate(-1);
    }
  };

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };
  if (isLoading) return <Loader />;

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="result">
        {data && data.length ? (
          <>
            <div className="search-title u700">
              <h1>{data[0]?.link_text}</h1>
              <h1>{localStorage.getItem("searchQuery")}</h1>
            </div>
            <div className="more-movies">
              {data[0]?.movies?.data.map((movieItem, index) => (
                <MovieSearch
                  movie={movieItem}
                  movieFocus={movieFocusSet}
                  focusKeey={`movieSearch_${index}`}
                />
              ))}
            </div>
          </>
        ) : null}

        {data.length === 0 && <h1>موردی یافت نشد !!</h1>}
        {data[0]?.movies?.data.length === 0 && <h1>موردی یافت نشد !!</h1>}
      </div>
    </FocusContext.Provider>
  );
};

export default SearchResult;
