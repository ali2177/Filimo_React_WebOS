import React, { useRef, useEffect, useState } from "react";
import { Focusable } from "react-js-spatial-navigation";

import { useNavigate, Link, useLocation } from "react-router-dom";
import LazyLoad from "react-lazy-load";
import placeHolder from "../../assets/images/Rectangle 4728.png";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

function Movie({
  movie,
  movieFocus,
  onFocus,
  onEnterPress,
  focusKeey,
  scrollRef,
  onscroll,
}) {
  const handleAction = () => {
    localStorage.setItem("lastFocus", focusKeey);
    if (movie.img) {
      localStorage.setItem("movie_uid", movie.link_key);
      navigate(`/livePlayer`);
    } else {
      navigate(`/movie/${movie.uid}`);
    }
  };

  const { ref, focused, focusSelf, focusKey } = useFocusable({
    focusKey: focusKeey,
    onArrowPress: (e) => {
      if (focusKey.slice(9) === "0") {
        // console.log(focusKey);
        if (e === "right") {
          if (localStorage.getItem("lastFocusMenuItem")) {
            setFocus(localStorage.getItem("lastFocusMenuItem"));
          } else {
            setFocus("menuItem__0");
          }
        }
      }
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
        localStorage.setItem("lastMovieFocus", focusKeey);
      }

      // console.log(focusKeey);
      // console.log(focusKeey[7]);

      // localStorage.setItem("lastFocusRow", focusKeey);

      if (parseInt(focusKeey[8]) >= 0) {
        localStorage.setItem(
          "lastFocusRow",
          `MOVIE_${focusKeey[6]}${focusKeey[7]}${focusKeey[8]}`
        );
      } else if (parseInt(focusKeey[7]) >= 0) {
        localStorage.setItem(
          "lastFocusRow",
          `MOVIE_${focusKeey[6]}${focusKeey[7]}`
        );
      } else {
        localStorage.setItem("lastFocusRow", `MOVIE_${focusKeey[6]}`);
      }
    },
    onEnterPress: () => {
      handleAction();
    },
  });
  const [isImageLoaded, setIsImageLoaded] = useState(true);
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
      if (localStorage.getItem("mode") === "KeyboardMode") {
        if (localStorage.getItem("kids-Lock") === true) {
          myRef?.current?.scrollIntoView({
            block: "center",
          });
        } else {
          myRef?.current?.scrollIntoView({
            block: focusKey.slice(6, 7) === "0" ? "end" : "center",
          });
        }
      }
    }, 10);
  };

  return (
    <div
      className={focused ? "btn-not-focus btn-focus" : "btn-not-focus"}
      ref={ref}
      style={{
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

//export default Movie;

export default Movie;
