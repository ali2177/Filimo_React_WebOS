import React, { useState, useRef, useEffect, useMemo } from "react";
import MovieSearch from "../Movie/MovieSearch.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const MoreSingle = () => {
  const { title } = useParams();
  const { ref, focusKey, focusSelf, focused } = useFocusable({
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "up", "down", "right"],
  });
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");
  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    setData(JSON.parse(localStorage.getItem("moreSingle")));
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
    setFocus("movieSearch_0");

    // focusSelf();
  }, []);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      localStorage.removeItem("moreSingle");
      navigate(-1);
    }
  };

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        style={{ paddingRight: "70px", paddingTop: "100px" }}
        className="result"
      >
        {title !== "undefined" && <h1>{title}</h1>}

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
