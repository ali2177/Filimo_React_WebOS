import React, { useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FocusContext,
  useFocusable,
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
  const { ref, focusKey } = useFocusable({
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
  const movieFocusSet = useCallback(
    (movie) => {
      movieFocused(movie);
    },
    [movieFocused],
  );
  const slicedMovies = useMemo(
    () => movies.slice(0, movies[0]?.output_type === "livetv" ? 4 : 6),
    [movies],
  );
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
            {slicedMovies.map((movie, i) => (
              // <div ref={myRef}>
              <div key={movie.uid ?? movie.id ?? i}>
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

export default React.memo(ContentRow);
