import React, { useEffect, useRef } from "react";
import {
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";

const Episode = ({ movieItem, focusKeey }) => {
  const myRef = useRef(null);
  const { ref, focused, focusSelf } = useFocusable({
    focusKey: focusKeey,
    onFocus: () => {
      handleScrolling();
    },
    onEnterPress: () => {
      console.log("pressed");
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });
  //   useEffect(() => {
  //     console.log(focusKeey);
  //     setFocus("Episode_0");
  //   }, []);
  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };
  const durationTimeFormat = (duration) => {
    const numberSide = Math.floor(duration / 60);
    return numberSide;
  };

  console.log(movieItem);

  return (
    <div ref={myRef} className="episode-wrapper">
      <div className="episode-pic-wrapper">
        <img
          ref={ref}
          className={
            focused ? "episode-pic episode-pic-focused" : "episode-pic"
          }
          src={
            movieItem?.thumbplay?.thumbplay_img_m
              ? movieItem?.thumbplay.thumbplay_img_m
              : movieItem.pic.movie_img_m
          }
          alt=""
        />
        <div className="episode-duration">
          {durationTimeFormat(Number(movieItem.duration))}:00
        </div>
        {movieItem.user_watched_info.is_watch && (
          <div className="episode-progressbar-wrapper">
            <div
              className="episode-progressbar"
              style={{ width: `${movieItem.user_watched_info.percent}%` }}
            ></div>
          </div>
        )}
      </div>
      <div>
        <div className="episode-header">
          <h3 className="u700">{movieItem.movie_title}</h3>
          {movieItem.user_watched_info.is_watch && (
            <div className="is-watched">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.9977 7.14871C19.1451 7.19238 19.2824 7.26475 19.4017 7.36166C19.5215 7.45794 19.6212 7.57695 19.6949 7.71186C19.7686 7.84677 19.8149 7.99491 19.8312 8.14778C19.8474 8.30065 19.8333 8.45522 19.7896 8.60262C19.746 8.75001 19.6736 8.88733 19.5767 9.00666L10.3367 20.475C10.2345 20.6015 10.107 20.7053 9.96233 20.7796C9.81767 20.854 9.65907 20.8972 9.4967 20.9067H9.43836C9.28482 20.9075 9.13262 20.8781 8.99047 20.8201C8.84833 20.762 8.71905 20.6765 8.61003 20.5683L3.85003 15.8317C3.72722 15.7279 3.62718 15.5999 3.55618 15.4557C3.48517 15.3115 3.44475 15.1541 3.43743 14.9935C3.43011 14.8329 3.45606 14.6726 3.51365 14.5225C3.57124 14.3724 3.65923 14.2358 3.7721 14.1213C3.88496 14.0068 4.02027 13.9169 4.16953 13.8572C4.31879 13.7975 4.47877 13.7693 4.63946 13.7743C4.80014 13.7794 4.95804 13.8175 5.10327 13.8865C5.24849 13.9554 5.3779 14.0537 5.48337 14.175L9.33336 17.99L17.7567 7.53666C17.853 7.41681 17.972 7.31717 18.1069 7.24347C18.2418 7.16977 18.39 7.12346 18.5428 7.10719C18.6957 7.09093 18.8503 7.10504 18.9977 7.14871ZM24.831 7.14871C24.9784 7.19238 25.1157 7.26475 25.235 7.36166C25.36 7.45819 25.4641 7.57909 25.541 7.71703C25.6179 7.85498 25.666 8.0071 25.6824 8.16418C25.6987 8.32126 25.683 8.48002 25.6362 8.63086C25.5894 8.78169 25.5124 8.92145 25.41 9.04166L16.17 20.51C16.0691 20.6351 15.9435 20.7381 15.8009 20.8123C15.6584 20.8866 15.5021 20.9307 15.3417 20.9417H15.2717C14.9656 20.9404 14.6723 20.8189 14.455 20.6033L13.195 19.3783C13.0003 19.1579 12.896 18.8721 12.903 18.5781C12.9099 18.2841 13.0277 18.0035 13.2327 17.7926C13.4377 17.5818 13.7148 17.4561 14.0085 17.4407C14.3022 17.4254 14.5909 17.5216 14.8167 17.71L15.1667 18.0367L23.59 7.53666C23.6863 7.41681 23.8053 7.31717 23.9402 7.24347C24.0751 7.16977 24.2233 7.12346 24.3761 7.10719C24.529 7.09093 24.6836 7.10504 24.831 7.14871Z"
                  fill="#E8E8E8"
                />
              </svg>
              {movieItem.user_watched_info.text}
            </div>
          )}
        </div>
        <p className="u400">{movieItem.descr.slice(0, 150)} ...</p>
      </div>
    </div>
  );
};

export default Episode;
