import React, { useRef, useState } from "react";
import { Focusable } from "react-js-spatial-navigation";

import { useNavigate, Link, useLocation } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { clearActorNavState } from "@src/utils/storageKeys";

function MovieRecoom({ movie, movieFocus, onFocus, onEnterPress, focusKeeey }) {
  const handleAction = () => {
    clearActorNavState();
    localStorage.removeItem("lastFocusMore");
    localStorage.removeItem("recommBtn");
    localStorage.removeItem("seasonBtn");

    navigate(`/movie/${movie.uid}`);
  };
  const location = useLocation("");
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    // onFocus: () => {
    //   handleScrolling();
    // },
    onEnterPress: () => {
      handleAction();
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focusKeeey,
  });
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const myRef = useRef();
  const navigate = useNavigate();

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
                src={movie.movie_img_m ? movie.movie_img_m : movie.img}
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

export default MovieRecoom;
