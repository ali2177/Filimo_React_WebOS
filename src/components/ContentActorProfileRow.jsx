import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import MovieList from "./MovieList/MovieList";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";

import MovieActorProfile from "./Movie/MovieActorProfile";
import MoreItem from "./Movie/MoreItem";

const ContentOnlyRow = ({
  title,
  movieFocused,
  movies,
  movieLinkKey,
  movieTag,
  onFocus,
  row,
  index,
}) => {
  // const [scroll, setscroll] = useState(0);
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onFocus,
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left"],
  });
  const location = useLocation();
  const navigate = useNavigate();
  const scrollingRef = useRef(null);
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
    movieFocused(movie);
  };
  const onAssetFocus = (i, movie) => {
    movieFocusSet(movie);

    if (i === 0) {
      scrollingRef.current.scrollLeft = 0;
      return;
    }
    if (scrollingRef.current) {
      if (event) {
        if (event.key === "ArrowLeft") {
          scrollingRef.current.scrollLeft -= 200;
        } else if (event.key === "ArrowRight") {
          scrollingRef.current.scrollLeft += 200;
        }
      }

      // console.log(x);
      // scrollingRef.current.scrollLeft -= 100;
      // console.log(scrollingRef.current.scrollLeft);
      // scrollingRef.current.style.scrollBehavior = "smooth";
    }
  };
  const handleInterPress = (movie, focusKeeey) => {
    navigate(`/movie/${movie.uid}`);
  };
  const handleMoreItemInterPress = (movie) => {
    navigate(`/moremovies/${row}`);
  };
  useEffect(() => {
    // setFocus("MOVIE_LIST_0");
    // if (localStorage.getItem("lastFocus") === null) {
    //   setFocus("MOVIE_LIST_0");
    // } else {
    //   setFocus(localStorage.getItem("lastFocus"));
    // }
    // console.log(focusKeey);
    // console.log(focusKey);
    focusSelf();
  }, []);
  useEffect(() => {
    // if (location.pathname === "/") {
    //   setFocus(localStorage.getItem("lastFocus"));
    // } else {
    //   console.log("notFound");
    //   setFocus("MOVIE_LIST_0");
    // }
    // setFocus(`MOVIE_LIST_${index}`);
    // console.log(getCurrentFocusKey());
    // console.log(focusKey);
    // focusSelf();
  }, [location]);
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
        className="contentRowWrapper"
        ref={ref}
        style={{ marginBottom: "100px" }}
      >
        <h3 className="u700">{title}</h3>
        <div className="contentScrollingWrapper" ref={scrollingRef}>
          <div className="contentRowScrollingContent">
            {movies.slice(0, 20).map((movie, i) => (
              // <div ref={myRef}>
              <div>
                <MovieActorProfile
                  movie={movie}
                  movieFocus={movieFocused}
                  onFocus={() => onAssetFocus(i, movie)}
                  onEnter={() => handleInterPress(movie)}
                />
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

export default ContentOnlyRow;
