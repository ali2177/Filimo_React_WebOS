import React, { useRef } from "react";
import { Focusable } from "react-js-spatial-navigation";
import { useNavigate, Link } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

function MovieNoScroll({ movie, movieFocus, onFocus }) {
  const { ref, focused } = useFocusable({
    onFocus,
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });
  const navigate = useNavigate();

  //set focus for current movie and pass it to parent
  const onMovieFocus = () => {
    movieFocus(movie);
  };

  return (
    // <Focusable
    //   className={"btn-focus"}
    //   onFocus={onMovieFocus}
    //   onClickEnter={() => {
    //     navigate(`/movie/${movie.uid}`);
    //   }}
    // >
    <div ref={ref}>
      <Link
        className="swiper-link"
        to={`/movie/${movie.uid}`}
        style={{
          backgroundColor: focused ? "green" : "gray",
        }}
      >
        {movie.movie_img_m ? (
          <img
            src={movie.movie_img_m}
            alt={movie.movie_title_en}
            className="swiper-image"
          />
        ) : (
          <img
            src={movie.pic.movie_img_m}
            alt={movie.movie_title_en}
            className="swiper-image"
          />
        )}
      </Link>
    </div>
    // </Focusable>
  );
}

//export default Movie;

export default MovieNoScroll;
