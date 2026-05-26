import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MovieList from "./MovieList/MovieList";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

import Movie from "./Movie/Movie";
import Actor from "./Actors/Actor";
import CrewSolo from "./Crews/CrewSolo";
const itemWith = 200;

const ContentCrewRow = ({
  title,
  movieFocused,
  movies,
  focusKeey,
  movieLinkKey,
  movieTag,
  onFocus,
  type,
}) => {
  // const [scroll, setscroll] = useState(0);
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onFocus,

    trackChildren: true,

    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right"],
  });
  const navigate = useNavigate();
  const scrollingRef = useRef();
  const myRef = useRef();
  const [curentMovie, setCurentMovie] = useState(null);
  // const handleScrolling = () => {
  //   myRef.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "center",
  //   });
  // };
  const movieFocusSet = (movie) => {
    setCurentMovie(movie);
  };
  const onAssetFocus = (i, movie) => {
    movieFocusSet(movie);

    if (i === 0) {
      scrollingRef.current.scrollLeft = 0;
      return;
    }
    if (scrollingRef.current) {
      if (event.key === "ArrowLeft") {
        scrollingRef.current.scrollLeft -= 200;
      } else if (event.key === "ArrowRight") {
        scrollingRef.current.scrollLeft += 200;
      }

      // console.log(x);
      // scrollingRef.current.scrollLeft -= 100;
      // console.log(scrollingRef.current.scrollLeft);
      // scrollingRef.current.style.scrollBehavior = "smooth";
    }
  };
  const handleInterPress = (movie) => {
    // console.log(movie.profile[0].name_en);
    if (type === "crew") {
      navigate(`/actor/${movie.profile[0].name_en}`);
    } else {
      navigate(`/actor/${movie.name_en}`);
    }
  };
  // useEffect(() => {
  //   setFocus("sn:focusable-item-12");
  //   // focusSelf();
  // }, [focusSelf]);
  // useEffect(() => {
  //   console.log("safhe avaz shod");
  //   console.log(focusKey);
  // }, [location]);
  // useEffect(() => {
  //   setFocus("sn:focusable-item-12");
  //   // focusSelf();
  // }, [focusSelf]);
  // useEffect(() => {
  //   setFocus("sn:focusable-item-23");
  //   //handleScrolling();
  // }, [setFocus, focusKey, focused]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className="contentRowWrapper"
        style={{ marginBottom: "2rem" }}
      >
        <div className="contentScrollingWrapper" ref={scrollingRef}>
          <div className="contentRowScrollingContent">
            {movies.slice(0, 8).map((movie, i) => (
              // <div ref={myRef}>
              <div id="main-page-movie">
                {type === "crew" ? (
                  <CrewSolo
                    key={movie}
                    actor={movie}
                    // onFocus={() => onAssetFocus(i, movie)}
                    onEnterPress={() => handleInterPress(movie)}
                    focusKeey={`Crew__${i}`}
                    name={
                      movie.profile[0].name_en ? movie.profile[0].name_en : "-1"
                    }
                  />
                ) : (
                  <Actor
                    actor={movie}
                    // onFocus={() => onAssetFocus(i, movie)}
                    onEnterPress={() => handleInterPress(movie)}
                    focusKeey={`Actor__${i}`}
                    name={movie.name_en ? movie.name_en : movie.name_fa}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* <MovieList
          movieFocused={movieFocused}
          row={movieLinkKey ? movieLinkKey : movieTag}
          movies={movies}
          focusKeey={focusKeey}
        /> */}
      </div>
    </FocusContext.Provider>
  );
};

export default ContentCrewRow;
