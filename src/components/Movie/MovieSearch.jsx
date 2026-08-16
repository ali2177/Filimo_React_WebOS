import React, { useRef, useState } from "react";
import { Focusable } from "react-js-spatial-navigation";

import { useNavigate, Link, useLocation } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useKeyboardAwareScroll } from "@src/hooks/useKeyboardAwareScroll";
import { uiStorage } from "@src/utils/uiStorage";

function MovieSearch({
  movie,
  movieFocus,
  onFocus,
  onEnterPress,
  focusKeey,
  onArrowPress,
}) {
  const handleAction = () => {
    uiStorage.removeItem("recommBtn");
    uiStorage.removeItem("seasonBtn");
    uiStorage.setItem("last", focusKeey);
    if (movie.img) {
      uiStorage.setItem("movie_uid", movie.link_key);
      navigate(`/livePlayer`);
    } else {
      navigate(`/movie/${movie.uid}`);
    }
  };
  const location = useLocation("");
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      handleScrolling();
    },
    onEnterPress: () => {
      handleAction();
    },
    onArrowPress: (direction, details) =>
      onArrowPress ? onArrowPress(direction, details) : true,
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
  const handleScrolling = useKeyboardAwareScroll(myRef);

  const onMovieFocus = () => {
    movieFocus(movie);
  };

  return (
    <div
      className={focused ? "btn-not-focus btn-focus" : "btn-not-focus"}
      ref={ref}
      style={{
        marginLeft: "4rem",
        marginBottom: "4rem",
        width: movie.type === "livetvs" ? "17.7rem" : "11.2rem",
        height: movie.type === "livetvs" ? "19rem" : "19rem",
      }}
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
        {movie.movie_img_s ? (
          <>
            {isImageLoaded ? (
              <img
                src={movie.movie_img_s ? movie.movie_img_s : movie.img}
                alt={movie.movie_title_en ? movie.movie_title_en : movie.title}
                className="swiper-image"
                onError={() => {
                  setIsImageLoaded(false);
                }}
                onMouseEnter={() => {
                  setFocus(focusKey);
                }}
                onClick={handleAction}
              />
            ) : (
              <div
                id="main-page-movie"
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
                onMouseEnter={() => {
                  setFocus(focusKey);
                }}
                onClick={handleAction}
              />
            ) : (
              <div
                id="main-page-movie"
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

        <h8 className="movie-title u500">
          {movie.movie_title ? movie.movie_title : movie.title}
        </h8>
      </section>

      {/* </Focusable> */}
    </div>
  );
}

//export default Movie;

export default MovieSearch;
