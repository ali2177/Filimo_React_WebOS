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
import MoreItem from "./Movie/MoreItem";

const ContentRow = ({
  title,
  movieFocused,
  movies,
  focusKeey,
  movieLinkKey,
  movieTag,
  onFocus,
  row,
  index,
  scrollRef,
}) => {
  // const [scroll, setscroll] = useState(0);
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onFocus,
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: index === 0 ? ["left", "up"] : ["left"],
    focusKey: focusKeey,
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
  // const onAssetFocus = (i, movie) => {
  //   movieFocusSet(movie);

  //   if (i === 0) {
  //     scrollingRef.current.scrollLeft = 0;
  //     return;
  //   }
  //   if (i === 10) {
  //     console.log("last");
  //   }
  //   if (scrollingRef.current) {
  //     const container = scrollingRef.current;
  //     const selectedMovie = container.children[i];

  //     if (selectedMovie) {
  //       const movieWidth = selectedMovie.offsetWidth;
  //       const containerWidth = container.offsetWidth;
  //       const maxScroll = container.scrollWidth - containerWidth;

  //       // Calculate the optimal scroll position
  //       let newScrollLeft =
  //         selectedMovie.offsetLeft -
  //         container.offsetLeft -
  //         containerWidth / 2 +
  //         movieWidth / 2;

  //       container.scrollLeft = newScrollLeft;
  //     }
  //     // if (event) {
  //     //   if (event.key === "ArrowLeft") {
  //     //     console.log("here");
  //     //     scrollingRef.current.scrollLeft -= 600;
  //     //   } else if (event.key === "ArrowRight") {
  //     //     scrollingRef.current.scrollLeft += 600;
  //     //   }
  //     // }
  //   }
  // };

  //     // console.log(x);
  //     // scrollingRef.current.scrollLeft -= 100;
  //     // console.log(scrollingRef.current.scrollLeft);
  //     // scrollingRef.current.style.scrollBehavior = "smooth";
  //   }
  // };

  const handleMoreItemInterPress = (movie) => {
    navigate(`/moremovies/${row}`);
  };
  useEffect(() => {
    // setFocus("MOVIE_LIST_0");
    // if (location.pathname === "/movies/filter/1/movie") {
    //   setFocus("MOVIE_LIST_0");
    // }
    // if (localStorage.getItem("lastFocus") === null) {
    //   setFocus("MOVIE_0__0");
    // } else {
    //   setFocus(localStorage.getItem("lastFocus"));
    // }
    // console.log(focusKeey);
    // console.log(focusKey);
    // focusSelf();
  }, []);
  useEffect(() => {
    // if (localStorage.getItem("lastFocus") === null) {
    //   setFocus("MOVIE_LIST_0");
    // } else {
    //   setFocus(localStorage.getItem("lastFocus"));
    // }
    // if (location.pathname === "/") {
    //   if (!localStorage.getItem("lastFocus") === null)
    //     setFocus(localStorage.getItem("lastFocus"));
    // } else {
    //   console.log("notFound");
    //   setFocus("MOVIE_0_0");
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
      <div className="contentRowWrapper" ref={ref}>
        <h3
          style={{ paddingTop: "0px", margin: "0.6rem 0.3rem 0 0" }}
          className="rows-main-header u700"
        >
          {title}
        </h3>
        <div className="contentScrollingWrapper">
          <div ref={scrollingRef} className="contentRowScrollingContent">
            {movies
              .slice(0, movies[0]?.output_type === "livetv" ? 4 : 6)
              .map((movie, i) => (
                // <div ref={myRef}>
                <div key={i}>
                  <Movie
                    movie={movie}
                    movieFocus={movieFocused}
                    // onFocus={() => onAssetFocus(i, movie)}
                    // onEnterPress={() => handleInterPress(movie)}
                    focusKeey={`MOVIE_${index}__${i}`}
                    scrollRef={scrollRef}
                    onscroll={() => {
                      // onAssetFocus(i);
                    }}
                  />
                </div>
              ))}
            <div>
              {movies.length > 6 && (
                <MoreItem
                  tag_id={row}
                  focusKeey={`More_${index}`}
                  type={
                    movies[0]?.output_type === "livetv" ? "live" : "mainPage"
                  }
                  linkText={
                    movies?.output_type === "livetv" ? movies.link_text : ""
                  }
                  movies={movies}
                  movieFocus={movieFocused}
                  onscroll={() => {
                    // onAssetFocus(10);
                  }}
                />
              )}
            </div>
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

export default ContentRow;
