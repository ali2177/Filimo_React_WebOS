import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";

import {
  FocusContext,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/televika_type.png";
import HeroBadge from "../HeroBadge/HeroBadge";

import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import Alert from "../Alert/Alert";
import PlayBotton from "./PlayBotton";
import SeasonBtn from "./SeasonsBtn";
import RecommBtn from "./RecommBtn";
import dot from "../../assets/genres/dot.svg";
import MoreBtn from "./MoreBtn";
import { stripHtmlTags } from "../../utils";

function MovieInfo({ isLogin }) {
  const { ref, focusKey, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });
  const location = useLocation();
  const navigate = useNavigate();
  const myRef = useRef(null);
  const seasonBtn = useRef(null);
  const recommBtn = useRef(null);
  const moreBtn = useRef(null);

  const { id } = useParams();
  const [isForbiden, setIsForbiden] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [movieData, setMovieData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  let jwt = localStorage.getItem("jwt");

  const convertToFarsi = (number) => {
    const farsiNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(number)
      .split("")
      .map((num) => farsiNumbers[num] || num)
      .join("");
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    localStorage.removeItem("subtitles");
    localStorage.removeItem("subtitle");
    localStorage.removeItem("formAction");
    localStorage.removeItem("movie_src");
    localStorage.removeItem("movie_last_watch_time");
    localStorage.removeItem("focusedSub");
    localStorage.removeItem("activeSub");
    // localStorage.removeItem("lastFocusRowBeforeReload");
    localStorage.removeItem("lastFocusRowSeriesBeforeReload");

    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    jwt = localStorage.getItem("jwt");
  }, [jwt]);

  // const { data, error, isFetching } = useGetMovieQuery({ id });
  // const {
  //   data: movieDetail,
  //   error: movieDetailError,
  //   isFetching: detailIsFetching,
  // } = useGetMovieDetailQuery({ id });
  // const {
  //   data: movieRecom,
  //   error: movieRecomError,
  //   isFetching: RecomIsFetching,
  // } = useGetMovieRecomQuery({ id });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoading && !isForbiden) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isLoading, isForbiden]);
  useEffect(() => {
    if (isForbiden)
      setTimeout(() => {
        setFocus("netError-btn");
      }, 10);
  }, [isForbiden]);

  useEffect(() => {
    getData();
    localStorage.removeItem("lastFocusMore");
    if (localStorage.getItem("moreBtn")) {
      setFocus("more-btn");
    } else if (localStorage.getItem("recommBtn")) {
      setFocus("recomm-btn");
    } else if (localStorage.getItem("seasonBtn")) {
      setFocus("season-btn");
    } else if (isForbiden) {
      setFocus("netError-btn");
    } else {
      window.scrollTo({ top: 0 });
      setFocus("paly-btn");
    }
  }, []);
  useEffect(() => {
    if (localStorage.getItem("moreBtn")) {
      setFocus("more-btn");
    } else if (localStorage.getItem("recommBtn")) {
      setFocus("recomm-btn");
    } else if (localStorage.getItem("seasonBtn")) {
      setFocus("season-btn");
    } else if (isForbiden) {
      setFocus("netError-btn");
    } else {
      setFocus("paly-btn");
    }
  }, [location, isForbiden]);
  const getData = async () => {
    const userAgent = {
      os: "WebOs",
      an: "Filimo",
      vn: "1.00",
    };
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${jwt}`);
    myHeaders.append("UserAgent", JSON.stringify(userAgent));
    myHeaders.append("Cookie", "AFCN=172569536257579");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://www.filimo.com/api/fa/v1/movie/movie/one/uid/${id}?devicetype=react_tizen&json_type=simple`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result?.errors?.[0]?.status) {
          setIsForbiden(true);
        } else {
          setMovieData(result);
          setTimeout(() => {
            setIsLoading(false);
          }, 2500);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // useEffect(() => {
  //   setMovieData(data);
  //   getData();
  // }, [data]);
  useEffect(() => {
    if (movieData) {
      // console.log(movieData);
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }
  }, [movieData]);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      localStorage.removeItem("seasonBtn");
      localStorage.removeItem("recommBtn");
      localStorage.removeItem("moreBtn");
      localStorage.removeItem("lastSeasonFocus");
      localStorage.removeItem("lastSeasonFocus_parent_new");
      localStorage.removeItem("lastSeasonFocus_season_part");
      localStorage.removeItem("movie_cast_time");
      localStorage.removeItem("movie_uid");
      localStorage.removeItem("fromAlert");
      window.scrollTo({ top: 0 });
      // if (JSON.parse(localStorage.getItem("lastRouteNotplayer"))[0]) {
      //   console.log(JSON.parse(localStorage.getItem("lastRouteNotplayer"))[1]);
      //   if (localStorage.getItem("lastRoute") === "/player") {
      //     navigate(JSON.parse(localStorage.getItem("lastRouteNotplayer"))[0]);

      //     // localStorage.setItem("lastRouteNotplayer", location.pathname);
      //   } else {
      //     navigate(-1);
      //   }
      // }

      if (localStorage.getItem("fromAlert") === "back") {
        navigate("/");
      } else {
        key.preventDefault();
        if (location.pathname !== "/player") navigate(-1);
      }
    }
  };
  // const onRowFocus = React.useCallback(
  //   ({ y }) => {
  //     console.log(y);
  //     myRef.current.scrollTo({
  //       top: y,
  //       behavior: "smooth",
  //     });
  //     // console.log(ref.current.scrollTop);
  //     // ref.current.scrollTop += 10;
  //     // console.log(ref.current.scrollTop);
  //     // ref.current.style.scrollBehavior = "smooth";
  //   },
  //   [ref]
  // );

  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      block: "end",
    });
  };
  const handleSeasonBtnFocus = () => {
    seasonBtn.current.scrollIntoView({
      block: "end",
    });
  };
  const handleRecommBtnFocus = () => {
    recommBtn.current.scrollIntoView({
      block: "end",
    });
  };
  const handleMoreBtnFocus = () => {
    moreBtn.current.scrollIntoView({
      block: "end",
    });
  };
  const handlePlayPress = () => {
    localStorage.removeItem("seasonBtn");
    localStorage.removeItem("recommBtn");
    localStorage.removeItem("moreBtn");
    if (movieData?.data?.watch_action.type === "watch") {
      localStorage.setItem(
        "subtitles",
        JSON.stringify(movieData.data.General?.subtitle?.data)
      );
      localStorage.setItem(
        "formAction",
        movieData.data?.watch_action?.visit_url?.formAction
      );

      localStorage.setItem(
        "movie_src",
        movieData?.data?.watch_action.movie_src
      );
      localStorage.setItem(
        "movie_cast_time",
        movieData?.data?.watch_action?.cast_skip_arr.cast_s
      );
      localStorage.setItem(
        "movie_last_watch_time",
        movieData?.data?.watch_action?.last_watch_position?.last_second
      );
      localStorage.setItem("movie_uid", movieData?.data?.General?.uid);

      navigate(`/player`);
      return;
    }
    if (movieData?.data?.watch_action.type === "pay") {
      if (isShowAlert) {
        return;
      }
      setIsShowAlert(true);
      setFocus("Alert-btn");
      return;
    }
    if (movieData?.data?.watch_action.type === "login") {
      navigate("/login");
    }
    if (movieData?.data?.watch_action.link_text === "تمدید اشتراک") {
      if (isShowAlert) {
        return;
      }
      setIsShowAlert(true);
      setFocus("Alert-btn");
    } else if (
      movieData?.data?.watch_action.link_text === "خرید بلیت و تماشا"
    ) {
      if (isShowAlert) {
        return;
      }
      setIsShowAlert(true);
      setFocus("Alert-btn");
      // setTimeout(() => {
      //   setIsShowAlert(false);
      // }, 2000);
    } else if (movieData?.data?.watch_action.link_text === "خرید اشتراک") {
      if (isShowAlert) {
        return;
      }
      setIsShowAlert(true);
      setFocus("Alert-btn");
    } else if (movieData?.data?.watch_action.link_text === "تمدید و تماشا") {
      if (isShowAlert) {
        return;
      }
      setIsShowAlert(true);
      setFocus("Alert-btn");
    }
  };

  if (isForbiden)
    return (
      <NetworkError
        errorText="این فیلم در پروفایل کودک قابل نمایش نیست."
        type="forbiden"
      />
    );

  if (isLoading) return <Loader />;

  if (!movieData) return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      {!isLoading && (
        <main id="movieinfo-page" className="main">
          {isShowAlert && (
            <Alert
              type={movieData?.data?.watch_action.type}
              handleBtnEnter={() => {
                setIsShowAlert(false);
                setFocus("paly-btn");
              }}
            />
          )}

          <div
            style={{
              background:
                "linear-gradient(0deg, #151515 0%, rgba(21, 21, 21, 0.25) 30%, rgba(21, 21, 21, 0.00) 100%), linear-gradient(270deg, rgba(21, 21, 21, 0.80) 0%, rgba(21, 21, 21, 0.40) 28.12%, rgba(21, 21, 21, 0.00) 46.87%)",
            }}
            className="hero"
          >
            {/* <div className="hero-gradiant"></div> */}
            {isImageLoaded ? (
              <img
                src={movieData?.data?.General?.cover_data.horizontal}
                className="hero-poster"
                onError={() => {
                  setIsImageLoaded(false);
                }}
                // alt={data?.title}
              />
            ) : (
              <div className="hero-poster" />
            )}
            <div className="hero-content">
              <div className="more-section-header">
                <img
                  src="https://www.filimo.com/assets/app/filimo/android/nlogo_tv/ic_filimo_banner_v3.webp"
                  className="logo-expended"
                />
              </div>
              <div className="hero-text">
                <h2 className="hero-text-title u700">
                  {movieData?.data?.General?.title}
                </h2>
                <p className="hero-text-descr u400">
                  {movieData?.data?.General.descr?.slice(0, 100)}
                  {movieData?.data?.General.descr?.length >= 100 ? "..." : null}
                </p>

                <HeroBadge movie={movieData?.data?.General} />
                {movieData?.data?.General?.serial.enable === true ? (
                  <div className="schedule">
                    {movieData?.data?.General?.serial.schedule && (
                      <>
                        <div className="calender">
                          <svg
                            className="calender-logo"
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.33333 10.5C8.689 10.5 8.16667 9.97766 8.16667 9.33333V8.16667H5.83333V12.8333H22.1667V8.16667H19.8333V9.33333C19.8333 9.97766 19.311 10.5 18.6667 10.5C18.0223 10.5 17.5 9.97766 17.5 9.33333V8.16667H10.5V9.33333C10.5 9.97766 9.97767 10.5 9.33333 10.5ZM17.5 5.83333H10.5V4.66667C10.5 4.02233 9.97767 3.5 9.33333 3.5C8.689 3.5 8.16667 4.02233 8.16667 4.66667V5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V21C3.5 22.2887 4.54467 23.3333 5.83333 23.3333H22.1667C23.4553 23.3333 24.5 22.2887 24.5 21V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H19.8333V4.66667C19.8333 4.02233 19.311 3.5 18.6667 3.5C18.0223 3.5 17.5 4.02233 17.5 4.66667V5.83333ZM5.83333 15.1667V21H22.1667V15.1667H5.83333Z"
                            />
                          </svg>
                          <span className="u500">
                            {movieData?.data?.General?.serial.schedule?.text}
                          </span>
                        </div>
                        <img className="dot" src={dot} />
                      </>
                    )}

                    <div className="calender">
                      <svg
                        className="calender-logo"
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M20.4167 4.66671H7.58332C7.2739 4.66671 6.97716 4.54379 6.75837 4.325C6.53957 4.10621 6.41666 3.80946 6.41666 3.50004C6.41666 3.19062 6.53957 2.89388 6.75837 2.67508C6.97716 2.45629 7.2739 2.33337 7.58332 2.33337H20.4167C20.7261 2.33337 21.0228 2.45629 21.2416 2.67508C21.4604 2.89388 21.5833 3.19062 21.5833 3.50004C21.5833 3.80946 21.4604 4.10621 21.2416 4.325C21.0228 4.54379 20.7261 4.66671 20.4167 4.66671ZM21.5833 22.1667H6.41666C5.4884 22.1667 4.59816 21.798 3.94178 21.1416C3.28541 20.4852 2.91666 19.595 2.91666 18.6667V9.33337C2.91666 8.40512 3.28541 7.51488 3.94178 6.8585C4.59816 6.20212 5.4884 5.83337 6.41666 5.83337H21.5833C22.5116 5.83337 23.4018 6.20212 24.0582 6.8585C24.7146 7.51488 25.0833 8.40512 25.0833 9.33337V18.6667C25.0833 19.595 24.7146 20.4852 24.0582 21.1416C23.4018 21.798 22.5116 22.1667 21.5833 22.1667ZM5.5917 8.50842C5.37291 8.72721 5.24999 9.02396 5.24999 9.33337V18.6667C5.24999 18.9761 5.37291 19.2729 5.5917 19.4917C5.81049 19.7105 6.10724 19.8334 6.41666 19.8334H21.5833C21.8927 19.8334 22.1895 19.7105 22.4083 19.4917C22.6271 19.2729 22.75 18.9761 22.75 18.6667V9.33337C22.75 9.02396 22.6271 8.72721 22.4083 8.50842C22.1895 8.28962 21.8927 8.16671 21.5833 8.16671H6.41666C6.10724 8.16671 5.81049 8.28962 5.5917 8.50842ZM20.4167 25.6667C20.7261 25.6667 21.0228 25.5438 21.2416 25.325C21.4604 25.1062 21.5833 24.8095 21.5833 24.5C21.5833 24.1906 21.4604 23.8939 21.2416 23.6751C21.0228 23.4563 20.7261 23.3334 20.4167 23.3334H7.58332C7.2739 23.3334 6.97716 23.4563 6.75837 23.6751C6.53957 23.8939 6.41666 24.1906 6.41666 24.5C6.41666 24.8095 6.53957 25.1062 6.75837 25.325C6.97716 25.5438 7.2739 25.6667 7.58332 25.6667H20.4167ZM16.555 14.9217L12.8333 17.4184C12.6569 17.5376 12.4512 17.6063 12.2385 17.617C12.0258 17.6277 11.8143 17.58 11.6268 17.4791C11.4393 17.3781 11.283 17.2278 11.1749 17.0443C11.0667 16.8609 11.0109 16.6513 11.0133 16.4384V11.4684C11.013 11.2564 11.0704 11.0484 11.1794 10.8666C11.2884 10.6849 11.4449 10.5362 11.632 10.4367C11.8191 10.3371 12.0298 10.2904 12.2415 10.3016C12.4531 10.3127 12.6577 10.3814 12.8333 10.5L16.555 12.985C16.7138 13.0918 16.8439 13.2359 16.9339 13.4048C17.0239 13.5736 17.0709 13.762 17.0709 13.9534C17.0709 14.1447 17.0239 14.3331 16.9339 14.502C16.8439 14.6708 16.7138 14.815 16.555 14.9217Z"
                        />
                      </svg>
                      <span className="u500">
                        {convertToFarsi(
                          movieData?.data?.General?.serial.season_id
                        )}
                      </span>
                      <span className="u500">فصل،</span>
                      <span className="u500">
                        {convertToFarsi(
                          movieData?.data?.General?.serial.serial_part
                        )}
                      </span>
                      <span className="u500">قسمت</span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div ref={myRef} className="hero-controls">
                <div ref={ref} style={{ display: "flex", width: "100%" }}>
                  <PlayBotton
                    data={movieData}
                    onAction={handlePlayPress}
                    onFocus={handleScrolling}
                  />
                  {movieData.data.General.serial.enable && (
                    <div style={{ marginLeft: "3rem" }} ref={seasonBtn}>
                      <SeasonBtn
                        seriesName={movieData?.data?.General?.title}
                        ui_id={movieData?.data?.General.uid}
                        onFocus={handleSeasonBtnFocus}
                      />
                    </div>
                  )}

                  <div style={{ marginLeft: "3rem" }} ref={recommBtn}>
                    <RecommBtn
                      onFocus={handleRecommBtnFocus}
                      linkText={"فیلم های پیشنهادی"}
                      uid={movieData?.data?.General?.uid}
                    />
                  </div>
                  <div ref={moreBtn}>
                    <MoreBtn
                      onFocus={handleMoreBtnFocus}
                      linkText={"توضیحات"}
                      uid={movieData?.data?.General?.uid}
                    />
                  </div>
                </div>
              </div>

              <section
                // style={{ marginRight: "2.1rem" }}
                className="movie-description"
              >
                <p className="movie-description-text u500">
                  {stripHtmlTags(movieData?.data?.General?.descr.slice(0, 200))}
                  {movieData?.data?.General?.descr.length > 100 ? " ..." : " "}
                </p>
              </section>
            </div>
          </div>
          {/* {!RecomIsFetching && movieRecom?.data && (
          <Recommendation movieRow={movieRecom?.data[0]} rowId={id} />
        )} */}
        </main>
      )}
    </FocusContext.Provider>
  );
}

export default MovieInfo;
