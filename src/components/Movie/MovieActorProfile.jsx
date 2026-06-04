import React, { useRef, useEffect, useState } from "react";
import { useKeyboardAwareScroll } from "@src/hooks/useKeyboardAwareScroll";
import { Focusable } from "react-js-spatial-navigation";

import { useNavigate, Link, useLocation } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { clearActorNavState } from "@src/utils/storageKeys";
import { uiStorage } from "@src/utils/uiStorage";

function MovieActorProfile({ movie, movieFocus, onEnterPress, focusKeey }) {
  const handleAction = () => {
    navigate(`/movie/${movie.attributes.uid}`);
    clearActorNavState();
    uiStorage.removeItem("lastFocusRecomm");
  };
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      handleScrolling();
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

  useEffect(() => {
    localStorage.removeItem("seasonBtn");
    localStorage.removeItem("recommBtn");
    uiStorage.removeItem("lastSeasonFocus");
  }, [location]);

  return (
    <div
      className={focused ? "btn-focus" : "btn-not-focus"}
      ref={ref}
      style={{ width: "220px", marginLeft: "3.4rem", marginBottom: "1.6rem" }}
      id="main-page-movie"
    >
      {/* <Focusable
        className={"btn-focus"}
        onFocus={onMovieFocus}
        onClickEnter={() => {
          navigate(`/movie/${movie.uid}`);
        }}
      > */}

      <Link
        ref={myRef}
        className="swiper-link"
        to={`/movie/${movie.attributes.uid}`}
      >
        {movie.attributes.pic.movie_img_m ? (
          <>
            {isImageLoaded ? (
              <img
                src={movie.attributes.pic.movie_img_m}
                alt={movie.attributes.movie_title_en}
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
                src={movie.attributes.pic.movie_img_m}
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
          {movie.attributes.movie_title.lenght > 10
            ? movie.attributes.movie_title.slice(0, 10)
            : movie.attributes.movie_title}
        </h8>
      </Link>
      {/* </Focusable> */}
    </div>
  );
}

//export default Movie;

export default MovieActorProfile;
