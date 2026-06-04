import React, { useState, useEffect, useCallback } from "react";
import { useBackKey } from "@src/hooks/useBackKey";
import { useDisableKeyboardWhileLoading } from "@src/hooks/useDisableKeyboardWhileLoading";
import MovieSearch from "@src/components/Movie/MovieSearch.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import Loader from "@src/components/Loader/Loader";
import { uiStorage } from "@src/utils/uiStorage";

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
    uiStorage.removeItem("seasonBtn");
    uiStorage.removeItem("recommBtn");
    setData(JSON.parse(localStorage.getItem("searchResult")));
  }, []);

  useDisableKeyboardWhileLoading(isLoading);

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

  const handleBack = useCallback(() => {
    if (location.pathname !== "/player") navigate(-1);
  }, [location.pathname, navigate]);

  useBackKey(handleBack);

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
