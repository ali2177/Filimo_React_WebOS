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
  faWindowClose,
} from "@fortawesome/fontawesome-free-solid";
import { useNavigate, useLocation } from "react-router-dom";
import NextEpisodeMenu from "./NextEpisodeMenu";
import Loader from "../Loader/Loader";
import Alert from "../Alert/Alert";
import SubtitleList from "./SubtitleList";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useAuth } from "../AuthProvider";
import { useOnlineStatus } from "../App";

import logo from "../../assets/images/aparat-kids-type-gray.svg";
import HlsTvPlayer from "../CustomPLayer/HlsTvPlayer";

let interval;
let interval2;
let index = 0;
let counter3 = 0;

const TvPlayer = () => {
  const { isOnline } = useOnlineStatus();
  const player = useTVPlayerStore((s) => s.player);
  const [isShowNextMenu, setIsShowNextMenu] = useState(false);
  const [isUiActive, setIsUiActive] = useState(false);
  const [movie, setMovie] = useState(null);
  const [movieWatchData, setMovieWatchData] = useState(null);
  const [movieUid, setMovieUid] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [movieCastTime, setMovieCastTime] = useState(null);
  const [movieIntroTimeStart, setMovieIntroTimeStart] = useState(null);
  const [movieIntroTimeEnd, setMovieIntroTimeEnd] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [activeQuality, setActiveQuality] = useState(0);
  const [formAction, setFormAction] = useState(null);
  const [treackLang, setTreackLang] = useState();
  const [audioTreacks, setAudioTreacks] = useState(null);
  const [qualityLevels, setQualityLevels] = useState(null);
  const [audioTreack, setAudioTreack] = useState();
  const [isShowSubList, setIsShowSubList] = useState(false);
  const [isShowQualList, setIsShowQualList] = useState(false);
  const [isShowAudList, setIsShowAudList] = useState(false);
  const [subtitles, setSubtitles] = useState([]);
  const [playing, setIsPlaying] = useState(true);

  const [isShowIntroBtn, setIsShowIntroBtn] = useState(false);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [isShowError, setIsShowError] = useState(false);

  const [counter, setCounter] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter4, setCounter4] = useState(0);
  const navigate = useNavigate();
  const location = useLocation("");

  useEffect(() => {
    const internalPlayer = player?.getInternalPlayer?.();
    console.log(internalPlayer);
    if (!internalPlayer) return;

    const interval = setInterval(() => {
      try {
        const currentTime = internalPlayer.currentTime;
        if (!isNaN(currentTime)) {
          localStorage.setItem("movie_last_watch_time", currentTime);
        }
      } catch (e) {
        // do nothing on error
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [player]);

  useEffect(() => {
    // getData();
    setJwt(localStorage.getItem("jwt"));
    setMovieUid(localStorage.getItem("movie_uid"));
    setFormAction(localStorage.getItem("formAction"));
    setMovieCastTime(localStorage.getItem("movie_cast_time"));
    // setSubtitles(JSON.parse(localStorage.getItem("subtitles")));
    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, []);
  useEffect(() => {
    setIsloading(true);
    // console.log(movieUid);
    if (movieUid || jwt) {
      getMovieData();
    }
  }, [movieUid, jwt, isOnline]);

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
      `https://www.filimo.com/api/fa/v1/movie/watch/watch/uid/${movieUid}/?devicetype=tizen_react`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        setMovieCastTime(result.data.attributes.cast.start);
        setMovieIntroTimeStart(result.data.attributes?.intro?.start);
        setMovieIntroTimeEnd(result.data.attributes?.intro?.end);
        setMovie(result.data.attributes.multiSRC[0][0].src);
        setMovieWatchData(result);

        setTimeout(() => {
          setIsloading(false);
        }, 3000);
      })
      .catch((error) => {
        setIsShowError(true);
        setTimeout(() => {
          setIsloading(false);
        }, 3000);
        console.log(error);
      });
  };

  // useEffect(() => {
  //   if (player) {
  //     setTimeout(() => {
  //       if (Number(localStorage.getItem("movie_last_watch_time")) > 0) {
  //         player.seekTo(
  //           Math.floor(player.getCurrentTime()) +
  //             localStorage.getItem("movie_last_watch_time")
  //         );
  //       }
  //     }, 1000);
  //   }
  // }, [localStorage.getItem("movie_last_watch_time")]);
  useEffect(() => {
    setIsShowNextMenu(false);

    if (player) {
      localStorage.setItem(
        "activeSub",
        player.getInternalPlayer()?.textTracks.length,
      );
      const hls = player.getInternalPlayer("hls");

      if (Number(localStorage.getItem("movie_last_watch_time")) > 0) {
        player.seekTo(
          player.getCurrentTime() +
            localStorage.getItem("movie_last_watch_time"),
        );
      }

      if (subtitles.length === 0) {
        if (player.getInternalPlayer()?.textTracks.length > 0) {
          for (
            let index = 0;
            index < player.getInternalPlayer()?.textTracks.length;
            index++
          ) {
            setSubtitles((prevState) => [
              ...prevState,
              player.getInternalPlayer()?.textTracks[index],
            ]);
          }

          // setSubtitles(player.getInternalPlayer()?.textTracks);
        }
      }

      if (hls?.levels) setQualityLevels(hls.levels);
      if (hls?.audioTracks) setAudioTreacks(hls.audioTracks);
    }
  }, [player]);

  const handleClick = (e) => {
    const metadata = document.querySelector(".metadata-wrapper");
    // document.querySelector(".tv-player-ui__cover")?.classList.remove("hide");
    // metadata.classList.remove("hide");
    // document.querySelector(".buttons")?.classList.remove("hide");
    // document.querySelector(".progress-bar")?.classList.remove("hide");
  };

  // const handleKeyDown = useCallback(
  //   (e) => {
  //     // Global logic
  //     if (!isShowSubList && !isShowAudList && !isShowQualList) {
  //       if (e.keyCode === 13) {
  //         const metadata = document.querySelector(".metadata-wrapper");
  //         if (metadata?.classList.contains("hide")) {
  //           e.stopPropagation();
  //           e.preventDefault();
  //           document
  //             .querySelector(".tv-player-ui__cover")
  //             ?.classList.remove("hide");
  //           metadata.classList.remove("hide");
  //           document.querySelector(".buttons")?.classList.remove("hide");
  //           document.querySelector(".progress-bar")?.classList.remove("hide");
  //         }
  //       }

  //       if ([10009, 8, 187, 461].includes(e.keyCode)) {
  //         e.stopPropagation();
  //         e.preventDefault();
  //         const metadata = document.querySelector(".metadata-wrapper");
  //         if (!metadata || metadata.classList.contains("hide")) {
  //           clearInterval(interval);
  //           clearInterval(interval2);
  //           navigate(-1);
  //         } else {
  //           document
  //             .querySelector(".tv-player-ui__cover")
  //             ?.classList.add("hide");
  //           metadata?.classList.add("hide");
  //           document.querySelector(".buttons")?.classList.add("hide");
  //           document.querySelector(".progress-bar")?.classList.add("hide");
  //         }
  //       }

  //       if (![10009, 8, 187, 13, 461].includes(e.keyCode)) {
  //         document
  //           .querySelector(".tv-player-ui__cover")
  //           ?.classList.remove("hide");
  //         document.querySelector(".metadata-wrapper")?.classList.remove("hide");
  //         document.querySelector(".buttons")?.classList.remove("hide");
  //         document.querySelector(".progress-bar")?.classList.remove("hide");
  //       }
  //     }

  //     // Subtitles list
  //     if (isShowSubList) {
  //       e.stopPropagation();
  //       e.preventDefault();
  //       if (e.key === "ArrowDown" && Number(counter) <= subtitles.length) {
  //         setCounter((prevState) => prevState + 1);
  //       }
  //       if (e.key === "ArrowUp" && Number(counter) > 0) {
  //         setCounter((prevState) => prevState - 1);
  //       }

  //       if (e.key === "Enter") {
  //         if (counter === subtitles.length) {
  //           setTreackLang(localStorage.getItem("focusedSub"));
  //           localStorage.setItem("activeSub", counter);
  //         }
  //         if (counter < subtitles.length) {
  //           setTreackLang(localStorage.getItem("focusedSub"));
  //           localStorage.setItem("activeSub", counter);
  //         }
  //         setIsShowSubList(false);
  //         setIsPlaying(true);
  //         const metadata = document.querySelector(".metadata-wrapper");
  //         document.querySelector(".tv-player-ui__cover")?.classList.add("hide");
  //         metadata?.classList.add("hide");
  //         document.querySelector(".buttons")?.classList.add("hide");
  //         document.querySelector(".progress-bar")?.classList.add("hide");
  //       }
  //       if ([10009, 8, 187, 461].includes(e.keyCode)) setIsShowSubList(false);
  //       return;
  //     }

  //     // Quality list
  //     if (isShowQualList) {
  //       e.stopPropagation();
  //       e.preventDefault();
  //       if (e.key === "ArrowDown" && counter2 <= qualityLevels.length)
  //         setCounter2((prevState) => prevState + 1);
  //       if (e.key === "ArrowUp" && counter2 > 0)
  //         setCounter2((prevState) => prevState - 1);
  //       if (e.key === "Enter") {
  //         const hls = player?.getInternalPlayer("hls");
  //         if (counter2 < qualityLevels.length) {
  //           hls.currentLevel = counter2;
  //           setActiveQuality(counter2);
  //         } else if (counter2 === qualityLevels.length) {
  //           hls.currentLevel = -1;
  //         }
  //         setIsShowQualList(false);
  //         setIsPlaying(true);
  //         const metadata = document.querySelector(".metadata-wrapper");
  //         document.querySelector(".tv-player-ui__cover")?.classList.add("hide");
  //         metadata?.classList.add("hide");
  //         document.querySelector(".buttons")?.classList.add("hide");
  //         document.querySelector(".progress-bar")?.classList.add("hide");
  //       }
  //       index++;
  //       if ([10009, 8, 187, 461].includes(e.keyCode)) setIsShowQualList(false);
  //       return;
  //     }

  //     // Next menu
  //     if (isShowNextMenu && movieWatchData?.data.attributes.cast.nextPartUid) {
  //       e.stopPropagation();
  //       e.preventDefault();
  //       if (e.key === "Enter") {
  //         if (counter3 === 0) {
  //           localStorage.setItem(
  //             "movie_uid",
  //             movieWatchData?.data.attributes.cast.nextPartUid
  //           );
  //           setIsShowNextMenu(false);
  //           window.location.reload();
  //         } else if (counter3 === 1) {
  //           setIsShowNextMenu(false);
  //         }
  //       }
  //       if (e.key === "ArrowLeft" && counter3 < 1) {
  //         counter3++;
  //         setFocus(`next-episode-player__${counter3}`);
  //       }
  //       if (e.key === "ArrowRight" && counter3 > 0) {
  //         counter3--;
  //         setFocus(`next-episode-player__${counter3}`);
  //       }
  //       return;
  //     }

  //     // Audio tracks
  //     if (isShowAudList) {
  //       e.stopPropagation();
  //       e.preventDefault();
  //       if (e.key === "ArrowDown" && counter4 < audioTreacks.length)
  //         setCounter4((prevState) => prevState + 1);
  //       if (e.key === "ArrowUp" && counter4 > 0)
  //         setCounter4((prevState) => prevState - 1);
  //       if (e.key === "Enter") {
  //         if (counter4 < audioTreacks.length) {
  //           setAudioTreack(localStorage.getItem("focusedSub"));
  //         }
  //         setIsShowAudList(false);
  //         setIsPlaying(true);
  //         const metadata = document.querySelector(".metadata-wrapper");
  //         document.querySelector(".tv-player-ui__cover")?.classList.add("hide");
  //         metadata?.classList.add("hide");
  //         document.querySelector(".buttons")?.classList.add("hide");
  //         document.querySelector(".progress-bar")?.classList.add("hide");
  //       }
  //       if ([10009, 8, 187, 461].includes(e.keyCode)) setIsShowAudList(false);
  //       return;
  //     }
  //   },
  //   [
  //     isShowSubList,
  //     isShowAudList,
  //     isShowQualList,
  //     isShowNextMenu,
  //     player,
  //     document.querySelector(".metadata-wrapper"),
  //     document.querySelector(".tv-player-ui__cover"),
  //     counter,
  //     counter2,
  //     counter4,
  //   ]
  // );

  function watchControls(rootEl, onChange) {
    const mo = new MutationObserver(() => {
      // adapt selectors to what you see in Elements panel
      const hide = rootEl
        .querySelector(".tv-player-ui__cover")
        ?.classList.contains("hide");

      onChange(!hide);
    });

    mo.observe(rootEl, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => mo.disconnect();
  }

  useEffect(() => {
    console.log("Onloaded player", player);
    if (player) {
      console.log(movie);
      console.log("loaded player", player);
    }
    const root = document.querySelector(".tv-player");
    if (!root) return;
    return watchControls(root, setIsUiActive);
  }, [player]);
  // useEffect(() => {
  //   counter3 = 0;

  //   window.addEventListener("keydown", handleKeyDown, true);
  //   window.addEventListener("click", handleClick, true);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown, true);
  //     window.removeEventListener("click", handleClick, true);
  //   };
  // }, [handleKeyDown, handleClick]);

  useEffect(() => {
    const backHandler = (e) => {
      // Custom event from webOS remote
      if (e.keyCode === 461 || e.keyCode === 8) {
        e.preventDefault();
        // do something like pause, prompt, or ignore
      }
    };
    window.addEventListener("keydown", backHandler);

    return () => {
      window.removeEventListener("keydown", backHandler);
    };
  }, []);
  useEffect(() => {
    if (isShowSubList) {
      setFocus(`sub__${counter}`);
    }
  }, [counter, isShowSubList]);
  useEffect(() => {
    if (isShowQualList) {
      setFocus(`sub__${counter2}`);
    }
  }, [counter2, isShowQualList]);
  useEffect(() => {
    if (isShowAudList) {
      setFocus(`sub__${counter4}`);
    }
  }, [counter4, isShowAudList]);

  useEffect(() => {
    if (treackLang) {
      const trackMain = player.getInternalPlayer()?.textTracks;
      // console.log(track);
      for (let index = 0; index < trackMain.length; index++) {
        if (trackMain[index].language === treackLang) {
          trackMain[index].mode = "showing";
        } else {
          trackMain[index].mode = "disabled";
        }
      }

      const video = player.getInternalPlayer();
      const overlay = document.getElementById("subtitle-overlay");

      // pick your subtitle track
      const track = [...video.textTracks].find(
        (t) => t.kind === "subtitles" && t.language === treackLang,
      );

      if (track) {
        // hide native rendering (still keeps cues available)
        // track.mode = "disabled";

        video.addEventListener("timeupdate", () => {
          const t = video.currentTime;
          let activeText = "";

          if (track.cues) {
            for (const cue of track.cues) {
              if (t >= cue.startTime && t <= cue.endTime) {
                activeText = cue.text;
                break;
              }
            }
          }
          overlay.textContent = activeText;
        });
      }
    }
  }, [treackLang]);
  useEffect(() => {
    if (audioTreack) {
      const hls = player.getInternalPlayer("hls");

      for (let index = 0; index < hls.audioTracks.length; index++) {
        if (hls.audioTracks[index].lang === audioTreack) {
          hls.audioTrack = hls.audioTracks[index].id;
        }
      }
    }
  }, [audioTreack]);

  const customButtonsWithSub = [
    ...(player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
    player?.getInternalPlayer()?.textTracks.length > 0
      ? [
          {
            action: "custom",
            align: "right",
            label: "زیرنویس",
            faIcon: faClosedCaptioning,
            onPress: () => {
              setIsShowSubList(true);
              setIsPlaying(false);
              setCounter(Number(localStorage.getItem("activeSub")));
            },
          },
          {
            action: "custom",
            align: "right",
            label: "کیفیت",
            faIcon: faList,
            onPress: () => {
              setCounter2(
                Number(player?.getInternalPlayer("hls")?.currentLevel),
              );
              setIsShowQualList(true);
              setIsPlaying(false);
              setTimeout(() => {
                setFocus(
                  `sub__${player.getInternalPlayer("hls").currentLevel}`,
                );
              }, [1]);
            },
          },
          {
            action: "custom",
            align: "right",
            label: "زبان",
            faIcon: faLanguage,
            onPress: () => {
              setIsShowAudList(true);
              setIsPlaying(false);
              setCounter4(player?.getInternalPlayer("hls")?.audioTrack);
            },
          },
          {
            action: "custom",
            align: "center",
            faIcon: faFastBackward,
            label: "ده ثانیه عقب",
            onPress: () => {
              const customSeek = () => {
                if (player.getCurrentTime() !== 0)
                  player.seekTo(player.getCurrentTime() - 10);
              };
              customSeek();
            },
          },
          { action: "playpause", label: "پخش", align: "center" },
          {
            action: "custom",
            align: "center",
            faIcon: faFastForward,
            label: "ده ثانیه جلو",
            onPress: () => {
              const customSeek = () => {
                player.seekTo(player.getCurrentTime() + 10);
              };

              customSeek();
            },
          },

          {
            action: "custom",
            align: "left",
            label: "بستن",
            faIcon: faWindowClose,
            onPress: () => {
              document
                .querySelector(".tv-player-ui__cover")
                .classList.add("hide");
              document.querySelector(".metadata-wrapper").classList.add("hide");
              document.querySelector(".buttons").classList.add("hide");
              document.querySelector(".progress-bar").classList.add("hide");
            },
          },
          { action: "mute", label: "بی صدا", align: "left" },
        ]
      : []),
    ...(!player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
    player?.getInternalPlayer()?.textTracks.length > 0
      ? [
          {
            action: "custom",
            align: "right",
            label: "زیرنویس",
            faIcon: faClosedCaptioning,
            onPress: () => {
              setIsShowSubList(true);
              setIsPlaying(false);
              setCounter(Number(localStorage.getItem("activeSub")));
            },
          },
          {
            action: "custom",
            align: "right",
            label: "کیفیت",
            faIcon: faList,
            onPress: () => {
              setCounter2(
                Number(player?.getInternalPlayer("hls")?.currentLevel),
              );
              setIsShowQualList(true);
              setIsPlaying(false);
              setTimeout(() => {
                setFocus(
                  `sub__${player.getInternalPlayer("hls").currentLevel}`,
                );
              }, [1]);
            },
          },

          {
            action: "custom",
            align: "center",
            faIcon: faFastBackward,
            label: "ده ثانیه عقب",

            onPress: () => {
              const customSeek = () => {
                if (player.getCurrentTime() !== 0)
                  player.seekTo(player.getCurrentTime() - 10);
              };
              customSeek();
            },
          },
          { action: "playpause", label: "پخش", align: "center" },
          {
            action: "custom",
            align: "center",
            faIcon: faFastForward,
            label: "ده ثانیه جلو",
            onPress: () => {
              const customSeek = () => {
                player.seekTo(player.getCurrentTime() + 10);
              };

              customSeek();
            },
          },
          {
            action: "custom",
            align: "left",
            label: "بستن",
            faIcon: faWindowClose,
            onPress: () => {
              document
                .querySelector(".tv-player-ui__cover")
                .classList.add("hide");
              document.querySelector(".metadata-wrapper").classList.add("hide");
              document.querySelector(".buttons").classList.add("hide");
              document.querySelector(".progress-bar").classList.add("hide");
            },
          },
          { action: "mute", label: "بی صدا", align: "left" },
        ]
      : []),
    ...(player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
    !player?.getInternalPlayer()?.textTracks.length > 0
      ? [
          {
            action: "custom",
            align: "right",
            label: "زبان",
            faIcon: faLanguage,
            onPress: () => {
              setIsShowAudList(true);
              setIsPlaying(false);
              setCounter4(player?.getInternalPlayer("hls")?.audioTrack);
            },
          },
          {
            action: "custom",
            align: "right",
            label: "کیفیت",
            faIcon: faList,
            onPress: () => {
              setCounter2(
                Number(player?.getInternalPlayer("hls")?.currentLevel),
              );
              setIsShowQualList(true);
              setIsPlaying(false);
              setTimeout(() => {
                setFocus(
                  `sub__${player.getInternalPlayer("hls").currentLevel}`,
                );
              }, [1]);
            },
          },

          {
            action: "custom",
            align: "center",
            faIcon: faFastBackward,
            label: "ده ثانیه عقب",

            onPress: () => {
              const customSeek = () => {
                if (player.getCurrentTime() !== 0)
                  player.seekTo(player.getCurrentTime() - 10);
              };
              customSeek();
            },
          },
          { action: "playpause", label: "پخش", align: "center" },

          {
            action: "custom",
            align: "center",
            faIcon: faFastForward,
            label: "ده ثانیه جلو",
            onPress: () => {
              const customSeek = () => {
                player.seekTo(player.getCurrentTime() + 10);
              };

              customSeek();
            },
          },

          {
            action: "custom",
            align: "left",
            label: "بستن",
            faIcon: faWindowClose,
            onPress: () => {
              document
                .querySelector(".tv-player-ui__cover")
                .classList.add("hide");
              document.querySelector(".metadata-wrapper").classList.add("hide");
              document.querySelector(".buttons").classList.add("hide");
              document.querySelector(".progress-bar").classList.add("hide");
            },
          },
          { action: "mute", label: "بی صدا", align: "left" },
        ]
      : []),
    ...(!player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
    !player?.getInternalPlayer()?.textTracks.length > 0
      ? [
          {
            action: "custom",
            align: "right",
            label: "کیفیت",
            faIcon: faList,
            onPress: () => {
              setCounter2(
                Number(player?.getInternalPlayer("hls")?.currentLevel),
              );
              setIsShowQualList(true);
              setIsPlaying(false);
              setTimeout(() => {
                setFocus(
                  `sub__${player.getInternalPlayer("hls").currentLevel}`,
                );
              }, [1]);
            },
          },
          {
            action: "custom",
            align: "center",
            faIcon: faFastBackward,
            label: "ده ثانیه عقب",

            onPress: () => {
              const customSeek = () => {
                if (player.getCurrentTime() !== 0)
                  player.seekTo(player.getCurrentTime() - 10);
              };
              customSeek();
            },
          },
          { action: "playpause", label: "پخش", align: "center" },
          {
            action: "custom",
            align: "center",
            faIcon: faFastForward,
            label: "ده ثانیه جلو",
            onPress: () => {
              const customSeek = () => {
                player.seekTo(player.getCurrentTime() + 10);
              };

              customSeek();
            },
          },

          {
            action: "custom",
            align: "left",
            label: "بستن",
            faIcon: faWindowClose,
            onPress: () => {
              document
                .querySelector(".tv-player-ui__cover")
                .classList.add("hide");
              document.querySelector(".metadata-wrapper").classList.add("hide");
              document.querySelector(".buttons").classList.add("hide");
              document.querySelector(".progress-bar").classList.add("hide");
            },
          },
          { action: "mute", label: "بی صدا", align: "left" },
        ]
      : []),

    ...(movieWatchData?.data.attributes.cast.nextPartUid
      ? [
          {
            action: "custom",
            align: "right",
            label: "قسمت بعدی",
            faIcon: faArrowAltCircleRight,
            onPress: () => {
              localStorage.setItem(
                "movie_uid",
                movieWatchData?.data.attributes.cast.nextPartUid,
              );
              localStorage.setItem("movie_last_watch_time", 0);
              window.location.reload();
            },
          },
        ]
      : []),
    ...(isShowIntroBtn
      ? [
          {
            action: "custom",
            align: "left",
            label: "رد کردن تیتراژ",
            faIcon: faArrowAltCircleRight,
            onPress: () => {
              player.seekTo(
                player.getCurrentTime() +
                  (movieIntroTimeEnd - movieIntroTimeStart),
              );
              setIsShowIntroBtn(false);
            },
          },
        ]
      : []),
    {
      action: "custom",
      label: "پخش مجدد",
      align: "center",
      faIcon: faReply,
      onPress: () => {
        player.seekTo(player.getCurrentTime() - player.getCurrentTime());
      },
    },
  ];

  const customButtonsWithNoAud = [
    {
      action: "custom",
      align: "right",
      label: "زیرنویس",
      faIcon: faClosedCaptioning,
      onPress: () => {
        setIsShowSubList(true);
        setIsPlaying(false);
        setCounter(Number(localStorage.getItem("activeSub")));
      },
    },
    {
      action: "custom",
      align: "center",
      faIcon: faFastBackward,
      label: " ",
      onPress: () => {
        const customSeek = () => {
          if (player.getCurrentTime() !== 0)
            player.seekTo(player.getCurrentTime() - 10);
        };
        customSeek();
      },
    },
    { action: "playpause", label: "پخش", align: "center" },
    {
      action: "custom",
      align: "center",
      faIcon: faFastForward,
      label: " ",
      onPress: () => {
        const customSeek = () => {
          player.seekTo(player.getCurrentTime() + 10);
        };

        customSeek();
      },
    },

    {
      action: "custom",
      align: "left",
      label: "بستن",
      faIcon: faWindowClose,
      onPress: () => {
        document.querySelector(".tv-player-ui__cover").classList.add("hide");
        document.querySelector(".metadata-wrapper").classList.add("hide");
        document.querySelector(".buttons").classList.add("hide");
        document.querySelector(".progress-bar").classList.add("hide");
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
      .then((result) => {
        // console.log("sent");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading) {
    if (isShowAlert) {
      // setFocus("Alert-btn");
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
  }
  if (isShowError) {
    return (
      <Alert
        type={!isOnline ? "error_player" : "error"}
        handleBtnEnter={() => {
          setIsShowError(false);
          window.location.reload();
        }}
      />
    );
  }
  if (movie !== null) {
    return (
      <main style={{ direction: "ltr", width: "100%" }} className="main-player">
        {isShowSubList && (
          <SubtitleList
            subtitles={subtitles}
            onClose={() => {
              setIsShowSubList(false);
            }}
            onTrackSet={(track, index) => {
              // console.log(track);
              setTreackLang(track);
            }}
            type={"subtitle"}
          />
          // <>
          //   <div className="sub-back"></div>
          //   <div className="subtitle-list u500">
          //     <div className="sub-content">
          //       <p style={{ textAlign: "center" }}>انتخاب زیرنویس</p>

          //       <hr />
          //       <ul>
          //         {subtitles.map((sub, index) => (
          //           <Focusable
          //             onClickEnter={() => {
          //               setTreackLang(sub.language);
          //               setIsShowSubList(false);
          //               setActiveSub(index);
          //             }}
          //             className="sub-header u700"
          //           >
          //             <li
          //               className={
          //                 activeSub === index ? "active-quality" : ""
          //               }
          //               id={index}
          //             >
          //               {sub.language}
          //             </li>
          //           </Focusable>
          //         ))}
          //         <li>
          //           <Focusable
          //             onClickEnter={() => {
          //               setTreackLang("none");
          //               setIsShowSubList(false);
          //             }}
          //             className="sub-header u700"
          //           >
          //             خاموش
          //           </Focusable>
          //         </li>
          //       </ul>
          //       <Focusable
          //         onClickEnter={() => {
          //           setIsShowSubList(false);
          //         }}
          //         className="sub-header"
          //       >
          //         بستن
          //       </Focusable>
          //     </div>
          //   </div>
          // </>
        )}
        {isShowQualList && (
          <SubtitleList
            subtitles={qualityLevels}
            onClose={() => {
              setIsShowQualList(false);
              setIsPlaying(true);
            }}
            onQualityEnterPress={(index) => {
              const hls = player?.getInternalPlayer("hls");
              hls.currentLevel = index;
              // player?.getInternalPlayer("hls").currentLevel = index;
              setIsShowQualList(false);
              setActiveQuality(index);
            }}
            type={"quality"}
          />
          // <>
          //   <div className="sub-back"></div>
          //   <div className="subtitle-list u500">
          //     <div className="sub-content">
          //       <p style={{ textAlign: "center" }}>انتخاب کیفیت</p>

          //       <hr />
          //       <ul>
          //         {qualityLevels.map((quality, index) => (
          //           <Focusable
          //             onClickEnter={() => {
          //               const hls = player?.getInternalPlayer("hls");
          //               hls.currentLevel = index;
          //               // player?.getInternalPlayer("hls").currentLevel = index;
          //               setIsShowQualList(false);
          //               setActiveQuality(index);
          //             }}
          //             className="sub-header u700"
          //           >
          //             <li
          //               className={
          //                 activeQuality === index ? "active-quality" : ""
          //               }
          //               id={index}
          //             >
          //               {quality.name}
          //             </li>
          //           </Focusable>
          //         ))}
          //         <li>
          //           <Focusable
          //             onClickEnter={() => {
          //               const hls = player?.getInternalPlayer("hls");
          //               hls.currentLevel = -1;
          //               // player?.getInternalPlayer("hls").currentLevel = index;
          //               setIsShowQualList(false);
          //             }}
          //             className="sub-header u700"
          //           >
          //             خودکار
          //           </Focusable>
          //         </li>
          //       </ul>
          //       <Focusable
          //         onClickEnter={() => {
          //           setIsShowQualList(false);
          //         }}
          //         className="sub-header"
          //       >
          //         بستن
          //       </Focusable>
          //     </div>
          //   </div>
          // </>
        )}
        {isShowNextMenu && movieWatchData?.data.attributes.cast.nextPartUid && (
          <NextEpisodeMenu
            nextEpisodeUid={movieWatchData?.data.attributes.cast.nextPartUid}
            onclose={() => {
              setIsShowNextMenu(false);
              setIsPlaying(true);
            }}
            onCounterFinish={() => {
              localStorage.setItem(
                "movie_uid",
                movieWatchData?.data.attributes.cast.nextPartUid,
              );
              setIsShowNextMenu(false);
              localStorage.setItem("movie_last_watch_time", 0);
              window.location.reload();
            }}
          />
        )}

        {isShowAudList && (
          <SubtitleList
            subtitles={audioTreacks}
            onClose={() => {
              setIsShowAudList(false);
              setIsPlaying(true);
            }}
            onTrackSet={(track) => {
              // console.log(track);
              setAudioTreack(track);
              setIsShowAudList(false);
            }}
            type={"audio"}
          />
          // <>
          //   <div className="sub-back"></div>
          //   <div className="subtitle-list u500">
          //     <div className="sub-content">
          //       <p style={{ textAlign: "center" }}>انتخاب زبان</p>

          //       <hr />
          //       <ul>
          //         {audioTreacks &&
          //           audioTreacks.map((aud) => (
          //             <li>
          //               <Focusable
          //                 onClickEnter={() => {
          //                   setAudioTreack(aud.lang);
          //                   setIsShowAudList(false);
          //                 }}
          //                 className="sub-header"
          //               >
          //                 {aud.name}
          //               </Focusable>
          //             </li>
          //           ))}
          //       </ul>
          //       <Focusable
          //         onClickEnter={() => {
          //           setIsShowAudList(false);
          //         }}
          //         className="sub-header"
          //       >
          //         بستن
          //       </Focusable>
          //     </div>
          //   </div>
          // </>
          // <div className="subtitle-list u500">

          //   </div>
          //   <div className="sub-back"></div>
          //   <div className="sub-content">
          //     <p style={{ textAlign: "center" }}>انتخاب زبان</p>

          //     <hr />
          //     <ul>
          //       {audioTreacks &&
          //         audioTreacks.map((aud) => (
          //           <li>
          //             <Focusable
          //               onClickEnter={() => {
          //                 setAudioTreack(aud.lang);
          //                 setIsShowAudList(false);
          //               }}
          //               className="sub-header"
          //             >
          //               {aud.name}
          //             </Focusable>
          //           </li>
          //         ))}
          //     </ul>
          //     <Focusable
          //       onClickEnter={() => {
          //         setIsShowAudList(false);
          //       }}
          //       className="sub-header"
          //     >
          //       بستن
          //     </Focusable>
          //   </div>
          // </div>
        )}

        <img
          className="watermark"
          src="https://www.filimo.com/assets/app/filimo/android/nlogo_tv/ic_watermark_v4.webp"
          alt=""
        />

        {movieWatchData && movie && (
          <>
            <HlsTvPlayer
              key={movieUid}
              src={movie}
              hlsOptions={{ enableWorker: true, maxBufferLength: 30 }}
              autoPlay={true}
              resumeFrom={Number(localStorage.getItem("movie_last_watch_time")) || 0}
              movieFullTitle={movieWatchData.data.attributes.movie_title.replace(
                ")",
                " ",
              )}
              isSeries={movieWatchData?.data.attributes.cast.nextPartUid}
              movieTitle={movieWatchData.data.attributes.movie_name}
              movieSubtitle={movieWatchData.data.attributes.season_episode}
              seriesData={movieWatchData?.data?.attributes?.seriesData}
              introStart={movieIntroTimeStart}
              introEnd={movieIntroTimeEnd}
              castData={movieWatchData?.data.attributes.cast}
              onNextEpisode={(uid) => {
                localStorage.setItem("movie_uid", uid);
                localStorage.setItem("movie_last_watch_time", 0);
                setMovieUid(uid);
              }}
            />
            {/* <TVPlayer
              hideControlsOnArrowUp={true}
              disableInitNav={true}
              subTitle={movieWatchData.data.attributes.movie_title.replace(
                ")",
                " ",
              )}
              playing={playing}
              url={movie}
              customButtons={customButtonsWithSub}
              config={{
                file: {
                  attributes: {
                    crossOrigin: "true",
                  },
                },
              }}
              onReady={() => {
                console.log("player is ready ?");
              }}
              onPlay={() => {
                console.log("player is playing ?");
                interval = setInterval(() => {
                  sendVisitUrl();
                }, 1000);
                interval2 = setInterval(() => {
                  if (
                    Math.floor(player.getCurrentTime()) ===
                    Number(movieCastTime)
                  ) {
                    if (movieCastTime === null) {
                      setIsShowNextMenu(false);
                    } else {
                      setIsShowNextMenu(true);
                    }
                  } else if (
                    Math.floor(player.getCurrentTime()) < Number(movieCastTime)
                  ) {
                    setIsShowNextMenu(false);
                  }
                  if (movieIntroTimeStart || movieIntroTimeEnd) {
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
              }}
              onPause={() => {
                clearInterval(interval);
                clearInterval(interval2);
              }}
            /> */}
            <div
              id="subtitle-overlay"
              className={
                isUiActive ? "subtitle-overlay rise" : "subtitle-overlay"
              }
            />
          </>
        )}
      </main>
    );
  }
};

export default TvPlayer;
