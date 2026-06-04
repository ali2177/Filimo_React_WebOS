import React, { useRef, useState } from "react";

import { useNavigate, Link, useLocation } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useKeyboardAwareScroll } from "@src/hooks/useKeyboardAwareScroll";
import { uiStorage } from "@src/utils/uiStorage";

function MovieMore({ movie, movieFocus, onFocus, onEnterPress, focusKeey }) {
  const handleAction = () => {
    if (uiStorage.getItem("level") === "level__1") {
      uiStorage.setItem("lastFocusMoreMovie_level__1", focusKeey);
      uiStorage.removeItem("lastFocusMore_level__1");
    } else if (uiStorage.getItem("level") === "level__2") {
      uiStorage.setItem("lastFocusMoreMovie_level__2", focusKeey);
      uiStorage.removeItem("lastFocusMore_level__2");
    } else {
      uiStorage.setItem("lastFocusMoreMovie", focusKeey);
    }
    navigate(`/movie/${movie.uid}`);
  };
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      handleScrolling();
      // onMovieFocus();
      // if (parseInt(focusKeey[7]) >= 0) {
      //   localStorage.setItem(
      //     "lastFocusRow",
      //     `MOVIE_${focusKeey[6]}${focusKeey[7]}`
      //   );
      // } else {
      //   uiStorage.setItem("lastFocusRow", `MOVIE_${focusKeey[6]}`);
      // }
    },
    onEnterPress: () => {
      handleAction();
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focusKeey,
  });
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const myRef = useRef();
  const navigate = useNavigate();
  const location = useLocation("");
  const handleScrolling = useKeyboardAwareScroll(myRef);

  const onMovieFocus = () => {
    movieFocus(movie);
  };

  return (
    <div
      className={focused ? "btn-focus" : "btn-not-focus"}
      ref={ref}
      style={{ width: "220px" }}
      id="main-page-movie"
    >
      {/* <Focusable
        className={"btn-focus"}
        onFocus={onMovieFocus}
        onClickEnter={() => {
          navigate(`/movie/${movie.uid}`);
        }}
      > */}

      <section ref={myRef} className="swiper-link">
        {movie.movie_img_m ? (
          <>
            {isImageLoaded ? (
              <img
                src={movie.movie_img_m}
                alt={movie.movie_title_en}
                className="swiper-image"
                onError={() => {
                  setIsImageLoaded(false);
                }}
                onClick={handleAction}
                onMouseEnter={() => {
                  setFocus(focusKey);
                }}
              />
            ) : (
              <div
                style={{
                  background:
                    "linear-gradient(180deg, #0c0c0c 0%, #151515 70.04%)",
                  height: "3rem !important",
                }}
                className="swiper-image"
                onClick={handleAction}
                onMouseEnter={() => {
                  setFocus(focusKey);
                }}
              />
            )}
          </>
        ) : (
          <>
            {isImageLoaded ? (
              <img
                src={
                  movie?.pic?.movie_img_m ? movie.pic.movie_img_m : movie.img
                }
                alt={movie.movie_title_en ? movie.movie_title_en : movie.title}
                className="swiper-image"
                onError={() => {
                  setIsImageLoaded(false);
                }}
                onClick={handleAction}
                onMouseEnter={() => {
                  setFocus(focusKey);
                }}
              />
            ) : (
              <div
                style={{
                  background:
                    "linear-gradient(180deg, #0c0c0c 0%, #151515 70.04%)",
                  height: "3rem !important",
                }}
                className="swiper-image"
                onClick={handleAction}
                onMouseEnter={() => {
                  setFocus(focusKey);
                }}
              />
            )}
          </>
        )}
        <h8 className="movie-title u500">{movie.movie_title}</h8>
      </section>
      {/* </Focusable> */}
    </div>
  );
}

//export default Movie;

export default MovieMore;
