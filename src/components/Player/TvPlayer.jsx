import React, { useEffect, useState, useRef } from "react";
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

let interval;
let interval2;
let jwt = localStorage.getItem("jwt");

const TvPlayer = () => {
  const player = useTVPlayerStore((s) => s.player);
  const [movie, setMovie] = useState(null);
  const [movieWatchData, setMovieWatchData] = useState(null);
  const [movieUid, setMovieUid] = useState(null);
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

  const [subtitles, setSubtitles] = useState(null);
  const [isShowIntroBtn, setIsShowIntroBtn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation("");

  useEffect(() => {
    // getData();
    setMovieUid(localStorage.getItem("movie_uid"));
    setFormAction(localStorage.getItem("formAction"));
    setMovieCastTime(localStorage.getItem("movie_cast_time"));
    setSubtitles(JSON.parse(localStorage.getItem("subtitles")));
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);
  useEffect(() => {
    setIsloading(true);
    console.log(movieUid);
    if (movieUid) {
      getMovieData();
    }
    return () => {
      window.removeEventListener("keydown", keyHandler);
      clearInterval(interval2);
    };
  }, [movieUid]);

  const getMovieData = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${jwt}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://www.filimo.com/api/fa/v1/movie/watch/watch/uid/${movieUid}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setMovieCastTime(result.data.attributes.cast.start);
        setMovieIntroTimeStart(result.data.attributes?.intro?.start);
        setMovieIntroTimeEnd(result.data.attributes?.intro?.end);
        setMovie(result.data.attributes.multiSRC[0][0].src);
        setMovieWatchData(result);
        setTimeout(() => {
          setIsloading(false);
        }, 3000);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    setIsShowNextMenu(false);

    if (player) {
      const hls = player.getInternalPlayer("hls");

      if (hls?.levels) setQualityLevels(hls.levels);
      if (hls?.audioTracks) setAudioTreacks(hls.audioTracks);
    }
  }, [player]);
  useEffect(() => {
    if (treackLang) {
      const track = player.getInternalPlayer()?.textTracks;
      for (let index = 0; index < track.length; index++) {
        if (track[index].language === treackLang) {
          track[index].mode = "showing";
        } else {
          track[index].mode = "disabled";
        }
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
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      clearInterval(interval2);
      clearInterval(interval);
      localStorage.setItem("lastRoute", location.pathname);
      navigate(-1);
    }
  };

  const customButtonsWithSub = [
    ...(player?.getInternalPlayer("hls")?.audioTracks.length > 0 &&
    player?.getInternalPlayer()?.textTracks.length > 0
      ? [
          {
            action: "custom",
            align: "right",
            label: " ",
            faIcon: faClosedCaptioning,
            onPress: () => {
              setIsShowSubList(true);
            },
          },
          {
            action: "custom",
            align: "right",
            label: " ",
            faIcon: faList,
            onPress: () => {
              setIsShowQualList(true);
            },
          },
          {
            action: "custom",
            align: "right",
            label: "زبان",
            faIcon: faLanguage,
            onPress: () => {
              setIsShowAudList(true);
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
            label: "بازگشت",
            faIcon: faArrowLeft,
            onPress: () => {
              localStorage.setItem("lastRoute", location.pathname);
              navigate(-1);
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
            label: " ",
            faIcon: faClosedCaptioning,
            onPress: () => {
              setIsShowSubList(true);
            },
          },
          {
            action: "custom",
            align: "right",
            label: " ",
            faIcon: faList,
            onPress: () => {
              setIsShowQualList(true);
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
            label: "بازگشت",
            faIcon: faArrowLeft,
            onPress: () => {
              navigate(-1);
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
            },
          },
          {
            action: "custom",
            align: "right",
            label: " ",
            faIcon: faList,
            onPress: () => {
              setIsShowQualList(true);
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
          { action: "playpause", label: "پخش مجدد", align: "center" },
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
            label: "بازگشت",
            faIcon: faArrowLeft,
            onPress: () => {
              navigate(-1);
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
            label: " ",
            faIcon: faList,
            onPress: () => {
              setIsShowQualList(true);
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
            label: "بازگشت",
            faIcon: faArrowLeft,
            onPress: () => {
              navigate(`/movie/${movie.uid}`);
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
                movieWatchData?.data.attributes.cast.nextPartUid
              );
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
            label: "رد کردن تیتراز",
            faIcon: faArrowAltCircleRight,
            onPress: () => {
              player.seekTo(
                player.getCurrentTime() +
                  (movieIntroTimeEnd - movieIntroTimeStart)
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
        window.location.reload();
      },
    },
  ];

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
      label: "بازگشت",
      faIcon: faArrowLeft,
      onPress: () => {
        navigate(-1);
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

  // if (isLoading) return <Loader />;

  return (
    <main style={{ direction: "ltr", width: "100%" }} className="main">
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
                    setTreackLang(sub.lng);
                    setIsShowSubList(false);
                    setActiveSub(index);
                  }}
                  className="sub-header u700"
                >
                  <li
                    className={activeSub === index ? "active-quality" : ""}
                    id={index}
                  >
                    {sub.lng_fa}
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
                    className={activeQuality === index ? "active-quality" : ""}
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

      {movieWatchData && (
        <TVPlayer
          subTitle={movieWatchData.data.attributes.movie_title}
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

            // console.log(hls.levels);
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
    </main>
  );
};

export default TvPlayer;
