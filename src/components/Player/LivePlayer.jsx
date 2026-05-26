import React, { useEffect, useState, useRef, useCallback } from "react";
import { TVPlayer, useTVPlayerStore } from "react-tv-player";
import { Focusable } from "react-js-spatial-navigation";
import {
  faArrowLeft,
  faClosedCaptioning,
  faLanguage,
  faFastBackward,
  faFastForward,
  faList,
  faReply,
  faArrowAltCircleRight,
} from "@fortawesome/fontawesome-free-solid";
import { useNavigate, useLocation } from "react-router-dom";
import NextEpisodeMenu from "./NextEpisodeMenu";
import Loader from "../Loader/Loader";
import Alert from "../Alert/Alert";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";

import "./live.css";

let interval;
let interval2;
let movieSrc;

const LivePlayer = () => {
  const player = useTVPlayerStore((s) => s.player);
  const [movie, setMovie] = useState(null);
  const [movieWatchData, setMovieWatchData] = useState(null);
  const [movieUid, setMovieUid] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [movieCastTime, setMovieCastTime] = useState(null);
  const [movieIntroTimeStart, setMovieIntroTimeStart] = useState(null);
  const [movieIntroTimeEnd, setMovieIntroTimeEnd] = useState(null);
  const [isShowNextMenu, setIsShowNextMenu] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [activeQuality, setActiveQuality] = useState(0);
  const [activeSub, setActiveSub] = useState(0);
  const [formAction, setFormAction] = useState(null);
  const [treackLang, setTreackLang] = useState();
  const [audioTreacks, setAudioTreacks] = useState(null);
  const [qualityLevels, setQualityLevels] = useState(null);
  const [audioTreack, setAudioTreack] = useState();
  const [isShowSubList, setIsShowSubList] = useState(false);
  const [isShowQualList, setIsShowQualList] = useState(false);
  const [isShowAudList, setIsShowAudList] = useState(false);

  const [subtitles, setSubtitles] = useState([]);
  const [isShowIntroBtn, setIsShowIntroBtn] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation("");

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);

    // getData();
    setJwt(localStorage.getItem("jwt"));
    setMovieUid(localStorage.getItem("movie_uid"));
    setFormAction(localStorage.getItem("formAction"));
    // setSubtitles(JSON.parse(localStorage.getItem("subtitles")));
    return () => {
      window.removeEventListener("keydown", keyHandler);
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, []);
  useEffect(() => {
    setIsloading(true);
    // console.log(movieUid);
    if (movieUid && jwt) {
      getMovieData();
    }
  }, [movieUid, jwt]);

  const getMovieData = () => {
    const userAgent = {
      os: "WebOs",
      an: "Filimo",
      vn: "1.00",
    };
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${jwt}`);
    myHeaders.append("UserAgent", JSON.stringify(userAgent));

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://www.filimo.com/api/fa/v1/live/live/one/live_name/${movieUid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result?.errors) {
          // console.log(result);
          setIsShowAlert(true);
          return;
        }
        if (result.data.attributes.watch_action?.type === "commingsoon") {
          setMovie("commingsoon");
        } else {
          setMovie(result.data.attributes.watch_action.src);
        }

        setMovieWatchData(result);
        setTimeout(() => {
          setIsloading(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setIsShowNextMenu(false);

    if (player) {
      const hls = player.getInternalPlayer("hls");
    }
  }, [player]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const progressBar = document.querySelector(".progress-bar");
      if (progressBar) {
        progressBar.style.display = "none";
      }
    });

    const target = document.querySelector(".tv-player-ui");
    if (target) {
      observer.observe(target, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [player]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        const metadata = document.querySelector(".metadata-wrapper");
        if (metadata?.classList.contains("hide")) {
          e.stopPropagation();
          e.preventDefault();
          document
            .querySelector(".tv-player-ui__cover")
            ?.classList.remove("hide");
          metadata.classList.remove("hide");
          document.querySelector(".buttons")?.classList.remove("hide");
          document.querySelector(".progress-bar")?.classList.remove("hide");
        }
      }
      if ([10009, 8, 187, 461].includes(e.keyCode)) {
        e.stopPropagation();
        e.preventDefault();
        const metadata = document.querySelector(".metadata-wrapper");
        if (!metadata || metadata.classList.contains("hide")) {
          clearInterval(interval);
          clearInterval(interval2);
          navigate(-1);
        } else {
          document.querySelector(".tv-player-ui__cover")?.classList.add("hide");
          metadata?.classList.add("hide");
          document.querySelector(".buttons")?.classList.add("hide");
          document.querySelector(".progress-bar")?.classList.add("hide");
        }
      }
      if (
        ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.code)
      ) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [player]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handleKeyDown]);

  // useEffect(() => {
  //   if (treackLang) {
  //     const track = player.getInternalPlayer()?.textTracks;
  //     for (let index = 0; index < track.length; index++) {
  //       if (track[index].language === treackLang) {
  //         track[index].mode = "showing";
  //       } else {
  //         track[index].mode = "disabled";
  //       }
  //     }
  //   }
  // }, [treackLang]);

  // useEffect(() => {
  //   if (audioTreack) {
  //     const hls = player.getInternalPlayer("hls");

  //     for (let index = 0; index < hls.audioTracks.length; index++) {
  //       if (hls.audioTracks[index].lang === audioTreack) {
  //         hls.audioTrack = hls.audioTracks[index].id;
  //       }
  //     }
  //   }
  // }, [audioTreack]);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      clearInterval(interval2);
      clearInterval(interval);
      // localStorage.setItem("lastRoute", location.pathname);
      // console.log("back");
      key.preventDefault();
      if (location.pathname !== "/player") navigate(-1);
    }
  };

  const customButtonsWithSub = [
    // {
    //   action: "custom",
    //   align: "left",
    //   label: "بازگشت",
    //   faIcon: faArrowLeft,
    //   onPress: () => {
    //     clearInterval(interval);
    //     clearInterval(interval2);
    //     localStorage.setItem("lastRoute", location.pathname);
    //     if (location.pathname !== "/player") navigate(-1);
    //   },
    // },
    // { action: "mute", label: "بی صدا", align: "left" },
    { action: "playpause", label: "پخش", align: "center" },
  ];
  // ...(player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
  // player?.getInternalPlayer()?.textTracks.length > 0
  //   ? [
  //       { action: "playpause", label: "پخش", align: "center" },

  //       {
  //         action: "custom",
  //         align: "left",
  //         label: "بازگشت",
  //         faIcon: faArrowLeft,
  //         onPress: () => {
  //           clearInterval(interval);
  //           clearInterval(interval2);
  //           localStorage.setItem("lastRoute", location.pathname);
  //           if (location.pathname !== "/player") navigate(-1);
  //         },
  //       },
  //       { action: "mute", label: "بی صدا", align: "left" },
  //     ]
  //   : []),
  // ...(!player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
  // player?.getInternalPlayer()?.textTracks.length > 0
  //   ? [
  //       { action: "playpause", label: "پخش", align: "center" },

  //       {
  //         action: "custom",
  //         align: "left",
  //         label: "بازگشت",
  //         faIcon: faArrowLeft,
  //         onPress: () => {
  //           clearInterval(interval);
  //           clearInterval(interval2);
  //           if (location.pathname !== "/player") navigate(-1);
  //         },
  //       },
  //       { action: "mute", label: "بی صدا", align: "left" },
  //     ]
  //   : []),
  // ...(player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
  // !player?.getInternalPlayer()?.textTracks.length > 0
  //   ? [
  //       { action: "playpause", label: "پخش", align: "center" },

  //       {
  //         action: "custom",
  //         align: "left",
  //         label: "بازگشت",
  //         faIcon: faArrowLeft,
  //         onPress: () => {
  //           clearInterval(interval);
  //           clearInterval(interval2);
  //           if (location.pathname !== "/player") navigate(-1);
  //         },
  //       },
  //       { action: "mute", label: "بی صدا", align: "left" },
  //     ]
  //   : []),
  // ...(!player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
  // !player?.getInternalPlayer()?.textTracks.length > 0
  //   ? [
  //       { action: "playpause", label: "پخش", align: "center" },

  //       {
  //         action: "custom",
  //         align: "left",
  //         label: "بازگشت",
  //         faIcon: faArrowLeft,
  //         onPress: () => {
  //           clearInterval(interval);
  //           clearInterval(interval2);
  //           if (location.pathname !== "/player") navigate(-1);
  //         },
  //       },
  //       { action: "mute", label: "بی صدا", align: "left" },
  //     ]
  //   : []),
  const customButtonsWithNoAud = [
    {
      action: "custom",
      align: "right",
      label: " ",
      faIcon: faClosedCaptioning,
      onPress: () => {
        setIsShowSubList(true);
      },
    },

    { action: "playpause", label: "پخش", align: "center" },

    {
      action: "custom",
      align: "left",
      label: "بازگشت",
      faIcon: faArrowLeft,
      onPress: () => {
        if (location.pathname !== "/player") navigate(-1);
      },
    },
    { action: "mute", label: "بی صدا", align: "left" },
  ];

  const sendVisitUrl = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(formAction, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(""))
      .catch((error) => console.log("error", error));
  };

  if (isLoading) {
    if (isShowAlert) {
      setFocus("Alert-btn");
      return (
        <Alert
          type={"null"}
          handleBtnEnter={() => {
            setIsShowAlert(false);
            navigate(`/movie/${movieUid}`);
            localStorage.setItem("fromAlert", "back");
          }}
        />
      );
    }
    return <Loader />;
  } else {
    if (movie !== null) {
      return (
        <main style={{ width: "100%" }} className="main mainLive">
          {isShowSubList && (
            <div className="subtitle-list u500">
              <div className="sub-back"></div>
              <div className="sub-content">
                <p style={{ textAlign: "center" }}>انتخاب زیرنویس</p>

                <hr />
                <ul>
                  {subtitles.map((sub, index) => (
                    <Focusable
                      onClickEnter={() => {
                        setTreackLang(sub.language);
                        setIsShowSubList(false);
                        setActiveSub(index);
                      }}
                      className="sub-header u700"
                    >
                      <li
                        className={activeSub === index ? "active-quality" : ""}
                        id={index}
                      >
                        {sub.language}
                      </li>
                    </Focusable>
                  ))}
                  <li>
                    <Focusable
                      onClickEnter={() => {
                        setTreackLang("none");
                        setIsShowSubList(false);
                      }}
                      className="sub-header u700"
                    >
                      خاموش
                    </Focusable>
                  </li>
                </ul>
                <Focusable
                  onClickEnter={() => {
                    setIsShowSubList(false);
                  }}
                  className="sub-header"
                >
                  بستن
                </Focusable>
              </div>
            </div>
          )}
          {isShowQualList && (
            <div className="subtitle-list u500">
              <div className="sub-back"></div>
              <div className="sub-content">
                <p style={{ textAlign: "center" }}>انتخاب کیفیت</p>

                <hr />
                <ul>
                  {qualityLevels.map((quality, index) => (
                    <Focusable
                      onClickEnter={() => {
                        const hls = player?.getInternalPlayer("hls");
                        hls.currentLevel = index;
                        // player?.getInternalPlayer("hls").currentLevel = index;
                        setIsShowQualList(false);
                        setActiveQuality(index);
                      }}
                      className="sub-header u700"
                    >
                      <li
                        className={
                          activeQuality === index ? "active-quality" : ""
                        }
                        id={index}
                      >
                        {quality.name}
                      </li>
                    </Focusable>
                  ))}
                  <li>
                    <Focusable
                      onClickEnter={() => {
                        const hls = player?.getInternalPlayer("hls");
                        hls.currentLevel = -1;
                        // player?.getInternalPlayer("hls").currentLevel = index;
                        setIsShowQualList(false);
                      }}
                      className="sub-header u700"
                    >
                      خودکار
                    </Focusable>
                  </li>
                </ul>
                <Focusable
                  onClickEnter={() => {
                    setIsShowQualList(false);
                  }}
                  className="sub-header"
                >
                  بستن
                </Focusable>
              </div>
            </div>
          )}
          {/* {isShowNextMenu && (
        <NextEpisodeMenu
          nextEpisodeTitle={movieWatchData.data.attributes.cast.nextPartTitle}
          nextEpisodeUid={movieWatchData.data.attributes.cast.nextPartUid}
          currentUid={movieUid}
        />
      )} */}

          {/* {isShowAudList && (
        <div className="subtitle-list u500">
          <div className="sub-back"></div>
          <div className="sub-content">
            <p style={{ textAlign: "center" }}>انتخاب زیرنویس</p>

            <hr />
            <ul>
              {audioTreacks &&
                audioTreacks.map((aud) => (
                  <li>
                    <Focusable
                      onClickEnter={() => {
                        setAudioTreack(aud.lang);
                        setIsShowAudList(false);
                      }}
                      className="sub-header"
                    >
                      {aud.name}
                    </Focusable>
                  </li>
                ))}
            </ul>
            <Focusable
              onClickEnter={() => {
                setIsShowAudList(false);
              }}
              className="sub-header"
            >
              بستن
            </Focusable>
          </div>
        </div>
      )} */}

          {movieWatchData && movie && (
            <>
              {movie === "commingsoon" && (
                <div className="comingsoon-wrapper">
                  <span className="u700">به زودی</span>
                </div>
              )}
              {movie !== "commingsoon" && (
                <TVPlayer
                  disableInitNav={true}
                  playing={true}
                  url={movie}
                  customButtons={customButtonsWithSub}
                  config={{
                    file: {
                      attributes: {
                        crossOrigin: "true",
                      },
                    },
                  }}
                  onPlay={() => {
                    player.seekTo(player.getCurrentTime() - 18);
                    interval = setInterval(() => {
                      sendVisitUrl();
                    }, 1000);
                    interval2 = setInterval(() => {
                      if (player.getCurrentTime() >= movieCastTime) {
                        if (movieCastTime === null) {
                          setIsShowNextMenu(false);
                        } else {
                          setIsShowNextMenu(true);
                        }
                        clearInterval(interval2);
                      } else {
                        setIsShowNextMenu(false);
                      }
                      if (movieIntroTimeStart && movieIntroTimeEnd) {
                        if (
                          player.getCurrentTime() >= movieIntroTimeStart &&
                          player.getCurrentTime() <= movieIntroTimeEnd
                        ) {
                          setIsShowIntroBtn(true);
                        }
                        if (player.getCurrentTime() > movieIntroTimeEnd) {
                          setIsShowIntroBtn(false);
                        }
                      }
                    }, 1000);

                    const hls = player?.getInternalPlayer("hls");

                    // // hls.currentLevel = hls.levels[1].bitrate;
                    // console.log(hls.currentLevel);
                    // hls.nextLevel = hls.levels[4];
                    // console.log(hls.nextLevel);
                    // console.log(hls.levels[4].bitrate);

                    // const intervalCall = setInterval(() => {
                    //   getData();
                    // }, 3000);
                  }}
                  onPause={() => {
                    clearInterval(interval);
                    clearInterval(interval2);
                  }}
                />
              )}
            </>
          )}
        </main>
      );
    }
  }
};

export default LivePlayer;
