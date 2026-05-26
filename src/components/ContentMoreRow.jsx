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

import Movie from "./Movie/Movie";
import MovieMore from "./Movie/MovieMore";
import MoreItem from "./Movie/MoreItem";

const ContentMoreRow = ({
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

  // const handleInterPress = (movie, focusKeeey) => {
  //   navigate(`/movie/${movie.uid}`);
  // };
  const handleMoreItemInterPress = (movie) => {
    navigate(`/moremovies/${row}`);
  };
  useEffect(() => {
    // if (localStorage.getItem("level")) {
    //   if (localStorage.getItem("level") === "level__1") {
    //     if (localStorage.getItem("lastFocusMore_level__1")) {
    //       setFocus(localStorage.getItem("lastFocusMore_level__1"));
    //     } else if (localStorage.getItem("lastFocusMoreMovie_level__1")) {
    //       setFocus(localStorage.getItem("lastFocusMoreMovie_level__1"));
    //     } else {
    //       setFocus("MOVIEMore_0_0");
    //     }
    //   }
    //   if (localStorage.getItem("level") === "level__2") {
    //     if (localStorage.getItem("lastFocusMore_level__2")) {
    //       setFocus(localStorage.getItem("lastFocusMore_level__2"));
    //     } else if (localStorage.getItem("lastFocusMoreMovie_level__2")) {
    //       setFocus(localStorage.getItem("lastFocusMoreMovie_level__2"));
    //     } else {
    //       setFocus("MOVIEMore_0_0");
    //     }
    //   }
    // } else {
    //   setFocus("MOVIEMore_0_0");
    // }
    // if (
    //   localStorage.getItem("lastFocusMore_level__1") ||
    //   localStorage.getItem("lastFocusMore_level__2")
    // ) {
    //   if (localStorage.getItem("level") === "level__1") {
    //     setFocus(localStorage.getItem("lastFocusMore_level__1"));
    //   } else if (localStorage.getItem("level") === "level__2") {
    //     if (localStorage.getItem("lastFocusMore_level__2")) {
    //       setFocus(localStorage.getItem("lastFocusMore_level__2"));
    //     } else if (localStorage.getItem("lastFocusMoreMovie_level__2")) {
    //       setFocus(localStorage.getItem("lastFocusMoreMovie_level__2"));
    //     } else {
    //       setFocus("MOVIEMore_0_0");
    //     }
    //   }
    // } else if (
    //   localStorage.getItem("lastFocusMoreMovie_level__1") ||
    //   localStorage.getItem("lastFocusMoreMovie_level__2")
    // ) {
    //   if (localStorage.getItem("level") === "level__1") {
    //     setFocus(localStorage.getItem("lastFocusMoreMovie_level__1"));
    //   } else if (localStorage.getItem("level") === "level__2") {
    //     setFocus(localStorage.getItem("lastFocusMoreMovie_level__2"));
    //   }
    // } else {
    //   if (!localStorage.getItem("lastFocusMoreMovie_level__1")) {
    //     setFocus("MOVIEMore_0_0");
    //   } else if (
    //     localStorage.getItem("lastFocusMoreMovie_level__1") &&
    //     !localStorage.getItem("lastFocusMoreMovie_level__2")
    //   ) {
    //     if (localStorage.getItem("level") === "level__1") {
    //       setFocus(localStorage.getItem("lastFocusMoreMovie_level__1"));
    //     } else if (localStorage.getItem("level") === "level__2") {
    //       setFocus("MOVIEMore_0_0");
    //     }
    //   }
    // }
    // if (localStorage.getItem("lastFocusMore")) {
    //   setFocus(localStorage.getItem("lastFocusMore"));
    // } else if (localStorage.getItem("lastFocusMoreMovie") === null) {
    //   setFocus("MOVIEMore_0_0");
    // } else {
    //   setFocus(localStorage.getItem("lastFocusMoreMovie"));
    // }
    // setFocus("MOVIEMore_0_0");
    // focusSelf();
    // setFocus("MOVIE_LIST_0");
    // if (localStorage.getItem("lastFocus") === null) {
    //   setFocus("MOVIE_LIST_0");
    // } else {
    //   setFocus(localStorage.getItem("lastFocus"));
    // }
    // console.log(focusKeey);
    // console.log(focusKey);
    // focusSelf();
  }, [movies, localStorage.getItem("level")]);
  useEffect(() => {
    // if (localStorage.getItem("lastFocusMore") === null) {
    //   setFocus("MOVIEMore_0_0");
    // } else {
    //   setFocus(localStorage.getItem("lastFocusMore"));
    // }
    // setFocus("MOVIE_0__0");
    // console.log(focusKey);
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
  const onAssetFocus = (i, movie) => {
    movieFocusSet(movie);

    if (i === 0) {
      scrollingRef.current.scrollLeft = 0;
      return;
    }
    if (scrollingRef.current) {
      const container = scrollingRef.current;
      const selectedMovie = container.children[i];
      // console.log(selectedMovie);

      if (selectedMovie) {
        const movieWidth = selectedMovie.offsetWidth;
        const containerWidth = container.offsetWidth;
        const maxScroll = container.scrollWidth - containerWidth;

        // Calculate the optimal scroll position
        let newScrollLeft =
          selectedMovie.offsetLeft -
          container.offsetLeft -
          containerWidth / 2 +
          movieWidth / 2;

        container.scrollLeft = newScrollLeft;
      }
      // if (event) {
      //   if (event.key === "ArrowLeft") {
      //     console.log("here");
      //     scrollingRef.current.scrollLeft -= 600;
      //   } else if (event.key === "ArrowRight") {
      //     scrollingRef.current.scrollLeft += 600;
      //   }
      // }
    }
  };
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
      <div className="contentRowWrapper" ref={ref}>
        <div className="contentScrollingWrapper">
          <div ref={scrollingRef} className="contentRowScrollingContent">
            {movies.slice(0, 6).map((movie, i) => (
              // <div ref={myRef}>
              <div>
                <MovieMore
                  movie={movie}
                  movieFocus={movieFocused}
                  // onFocus={() => onAssetFocus(i, movie)}
                  // onEnter={() => handleInterPress(movie)}
                  focusKeey={`MOVIEMore_${index}_${i}`}
                  onscroll={() => {
                    onAssetFocus(i);
                  }}
                />
              </div>
            ))}
            <MoreItem
              tag_id={row}
              onFocus={() => onAssetFocus()}
              onEnterPress={handleMoreItemInterPress}
              focusKeey={`More_${index}`}
              type={"morePage"}
              movies={movies}
              linkText={movieTag}
              onscroll={() => {
                onAssetFocus(6);
              }}
            />
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

export default ContentMoreRow;
