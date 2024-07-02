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
} from "@fortawesome/fontawesome-free-solid";
import { useNavigate } from "react-router-dom";

let interval;

const TvPlayer = () => {
  const player = useTVPlayerStore((s) => s.player);
  const [movie, setMovie] = useState(null);
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
  const [isShowPlayerWithSub, setIsShowPlayerWithSub] = useState(false);
  const [subtitles, setSubtitles] = useState(null);
  const [playerSubFormat, setPlayerSubFormat] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // getData();
    window.addEventListener("keydown", keyHandler);
    setMovie(localStorage.getItem("movie_src"));
    setFormAction(localStorage.getItem("formAction"));
    setSubtitles(JSON.parse(localStorage.getItem("subtitles")));
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
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
              navigate(-1);
            },
          },
          { action: "mute", label: "بی صدا", align: "left" },
        ]
      : []),
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
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

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

      <TVPlayer
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
        }}
      />
    </main>
  );
};

export default TvPlayer;
