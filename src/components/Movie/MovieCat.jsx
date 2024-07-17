import React, { useRef, useEffect } from "react";
import { Focusable } from "react-js-spatial-navigation";

import { useNavigate, Link, useLocation } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

function MovieCat({ movie, movieFocus, onFocus, onEnterPress, focusKeey }) {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      handleScrolling();
    },
    onEnterPress: () => {
      localStorage.setItem("lastFocusCat", focusKeey);
      navigate(`/movie/${movie.uid}`);
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focusKeey,
  });
  const myRef = useRef();
  const navigate = useNavigate();

  //set focus for current movie and pass it to parent
  const onMovieFocus = () => {
    movieFocus(movie);
  };
  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };
  useEffect(() => {
    console.log(movie);
    if (movie.badge.hear) {
      console.log(movie.badge.hear);
    }
  }, [movie]);

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

export default MovieCat;
