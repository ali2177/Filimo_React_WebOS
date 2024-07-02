import React, { useRef, useEffect } from "react";
import { Focusable } from "react-js-spatial-navigation";

import { useNavigate, Link, useLocation } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

function Movie({ movie, movieFocus, onFocus, onEnterPress, focusKeey }) {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    focusKey: focusKeey,
    onFocus: () => {
      // handleScrolling();
      onMovieFocus();
      if (parseInt(focusKeey[7]) >= 0) {
        localStorage.setItem(
          "lastFocusRow",
          `MOVIE_${focusKeey[6]}${focusKeey[7]}`
        );
      } else {
        localStorage.setItem("lastFocusRow", `MOVIE_${focusKeey[6]}`);
      }
    },
    onEnterPress: () => {
      localStorage.setItem("lastFocus", focusKeey);
      navigate(`/movie/${movie.uid}`);
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });
  const myRef = useRef();
  const navigate = useNavigate();

  //set focus for current movie and pass it to parent
  const onMovieFocus = () => {
    movieFocus(movie);
  };
  // const handleScrolling = () => {
  //   myRef.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "end",
  //   });
  // };

  return (
    <div
      className={focused ? "btn-focus" : "btn-not-focus"}
      ref={ref}
      style={{ width: "220px" }}
    >
      {/* <Focusable
        className={"btn-focus"}
        onFocus={onMovieFocus}
        onClickEnter={() => {
          navigate(`/movie/${movie.uid}`);
        }}
      > */}

      <Link ref={myRef} className="swiper-link" to={`/movie/${movie.uid}`}>
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
        <h8 className="movie-title u500">{movie.movie_title}</h8>
      </Link>
      {/* </Focusable> */}
    </div>
  );
}

//export default Movie;

export default Movie;
