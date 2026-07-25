import React, { useRef, useEffect, useState } from "react";
import { Focusable } from "react-js-spatial-navigation";
import { uiStorage } from "@src/utils/uiStorage";

import { useNavigate, Link, useLocation } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useOnlineStatus } from "@src/app/App";
import { centerHorizontally, scrollVertically } from "@src/utils/scrollHelpers";

// True on 4K (and larger) panels, where the higher-res thumbplay image is worth
// the bytes. Computed once — a TV's screen resolution is fixed for the session.
// Uses physical pixels (innerWidth × DPR) since webOS often reports a 1920 CSS
// viewport on 4K hardware, and falls back to screen.width.
const IS_LARGE_SCREEN =
  typeof window !== "undefined" &&
  Math.max(
    window.screen?.width || 0,
    (window.innerWidth || 0) * (window.devicePixelRatio || 1),
  ) >= 3840;

function Movie({
  movie,
  movieFocus,
  onFocus,
  onEnterPress,
  focusKeey,
  scrollRef,
  onscroll,
  hasSlider,
}) {
  const handleAction = () => {
    uiStorage.setItem("lastFocus", focusKeey);
    if (movie.img) {
      uiStorage.setItem("movie_uid", movie.link_key);
      navigate(`/livePlayer`);
    } else {
      navigate(`/movie/${movie.uid}`);
    }
  };

  const { ref, focused, focusSelf, focusKey } = useFocusable({
    focusKey: focusKeey,
    onArrowPress: (e) => {
      // First content row + Up returns to the hero slider (when present). The
      // active slide may hide its play button (button_type "none"), so aim for
      // the dots instead — otherwise focus is lost on a missing SLIDER_PLAY.
      if (hasSlider && focusKey.slice(6, 7) === "0" && e === "up") {
        setFocus(
          uiStorage.getItem("sliderHasPlay") === "0"
            ? "SLIDER_DOTS"
            : "SLIDER_PLAY",
        );
        return false;
      }
      if (focusKey.slice(9) === "0") {
        // console.log(focusKey);
        if (e === "right") {
          if (uiStorage.getItem("lastFocusMenuItem")) {
            setFocus(uiStorage.getItem("lastFocusMenuItem"));
          } else {
            setFocus("menuItem__0");
          }
        }
      }
      return true;
    },
    onFocus: () => {
      if (window.location.pathname === "/") {
        onscroll();
      } else {
        // console.log("nist");
      }

      handleScrolling();
      onMovieFocus();

      if (
        focusKeey.slice(9) === "0" ||
        focusKeey.slice(10) === "0" ||
        focusKeey.slice(11) === "0"
      ) {
        // console.log("movie here");
        // console.log(focusKeey);
        uiStorage.setItem("lastMovieFocus", focusKeey);
      }

      // console.log(focusKeey);
      // console.log(focusKeey[7]);

      // localStorage.setItem("lastFocusRow", focusKeey);

      if (parseInt(focusKeey[8]) >= 0) {
        uiStorage.setItem(
          "lastFocusRow",
          `MOVIE_${focusKeey[6]}${focusKeey[7]}${focusKeey[8]}`,
        );
      } else if (parseInt(focusKeey[7]) >= 0) {
        uiStorage.setItem(
          "lastFocusRow",
          `MOVIE_${focusKeey[6]}${focusKeey[7]}`,
        );
      } else {
        uiStorage.setItem("lastFocusRow", `MOVIE_${focusKeey[6]}`);
      }
    },
    onEnterPress: () => {
      handleAction();
    },
  });
  const { isKid } = useOnlineStatus();
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  // Thumbplay rows render landscape cards using the item's thumbplay image
  // (medium size). Every other theme keeps the original portrait poster.
  const isThumbplay = movie.theme === "thumbplay";
  // Live TV cards are landscape too, and share the thumbplay card dimensions.
  const isLive = movie.type === "livetvs";
  const isLandscape = isThumbplay || isLive;
  // On 4K+ panels use the high-res thumbplay image; smaller screens keep the
  // medium size. Falls back to medium when the big variant is missing.
  const thumbplaySrc = IS_LARGE_SCREEN
    ? movie?.thumbplay?.thumbplay_img_b || movie?.thumbplay?.thumbplay_img_m
    : movie?.thumbplay?.thumbplay_img_m;
  const imgSrc = isThumbplay
    ? thumbplaySrc ||
      movie?.cover_data?.horizontal ||
      movie?.pic?.movie_img_m ||
      movie.img
    : movie.movie_img_m || movie?.pic?.movie_img_m || movie.img;
  const imgClass = isLandscape
    ? "swiper-image swiper-image-landscape"
    : "swiper-image";
  const location = useLocation("");
  const myRef = useRef();
  const navigate = useNavigate();

  //set focus for current movie and pass it to parent
  const onMovieFocus = () => {
    // console.log(movie);
    movieFocus(movie, focusKeey);
  };
  // function scrollToTargetAdjusted() {
  //   const headerOffset = 10;
  //   const elementPosition = myRef.current.getBoundingClientRect().top;
  //   const offsetPosition = elementPosition + window.scrollY - headerOffset;
  //   window.scrollTo({
  //     top: offsetPosition,
  //     behavior: "smooth",
  //   });
  // }
  // const handleScrolling = () => {
  //   const headerOffset = 70;
  //   console.log(myRef.current.getBoundingClientRect().top);
  //   console.log(window.scrollY);
  //   const elementPosition = myRef.current.getBoundingClientRect().top;
  //   const offsetPosition = elementPosition + window.scrollY - headerOffset;
  //   console.log(offsetPosition);
  //   // window.scrollTo({
  //   //   top: offsetPosition,
  //   //   behavior: "smooth",
  //   // });
  //   scrollRef.current.scrollTop = offsetPosition;
  // };
  // console.log(focusKey);
  const handleScrolling = () => {
    setTimeout(() => {
      if (uiStorage.getItem("mode") === "KeyboardMode") {
        // Keep the focused card centered in its row.
        centerHorizontally(myRef.current);
        // First row aligns to the bottom edge (so it sits just under the hero);
        // every other row (and kids mode) centers vertically.
        scrollVertically(
          myRef.current,
          !isKid && focusKey.slice(6, 7) === "0" ? "end" : "center",
        );
      }
    }, 10);
  };

  return (
    <div
      className={focused ? "btn-not-focus btn-focus" : "btn-not-focus"}
      ref={ref}
      style={{
        width: isLandscape ? "20.5rem" : "11.2rem",
        height: "auto",
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
        {isImageLoaded ? (
          <img
            src={imgSrc}
            alt={movie.movie_title_en ? movie.movie_title_en : movie.title}
            className={imgClass}
            width={isLandscape ? "400" : "212"}
            height={isLandscape ? "225" : "300"}
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
              background: "linear-gradient(180deg, #0c0c0c 0%, #151515 70.04%)",
            }}
            className={imgClass}
            onClick={handleAction}
            onMouseEnter={() => {
              setFocus(focusKey);
            }}
          />
        )}
        <span className="movie-title u500">
          {movie.movie_title ? (
            <>
              {movie.movie_title.length > 20
                ? movie.movie_title.slice(0, 20)
                : movie.movie_title}
              {movie.movie_title.length > 20 ? "..." : null}
            </>
          ) : (
            <>
              {movie.title.length > 20 ? movie.title.slice(0, 20) : movie.title}
              {movie.title.length > 20 ? "..." : null}
            </>
          )}
        </span>
      </section>
      {/* </Focusable> */}
    </div>
  );
}

export default React.memo(Movie);
