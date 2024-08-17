import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import {
  useGetMovieQuery,
  useGetMovieDetailQuery,
  useGetMovieRecomQuery,
} from "../../services/TMDB";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import calender from "../../assets/images/calender-white.svg";
import logo from "../../assets/images/televika_type.png";
import HeroBadge from "../HeroBadge/HeroBadge";
import MovieDetailBadge from "../MovieDetailBadge/MovieDetailBadge";
import Recommendation from "../Recomendation/Recommendation";
import Actors from "../Actors/Actors";
import Crews from "../Crews/Crews";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import { stripHtmlTags } from "../../utils";
import Alert from "../Alert/Alert";
import PlayBotton from "./PlayBotton";
import SeasonBtn from "./SeasonsBtn";
import RecommBtn from "./RecommBtn";

function MovieInfo({ isLogin }) {
  const { ref, focusKey, focusSelf, focused } = useFocusable();
  const location = useLocation();
  const navigate = useNavigate();
  const myRef = useRef(null);
  const seasonBtn = useRef(null);
  const recommBtn = useRef(null);

  const { id } = useParams();
  const [isShowAlert, setIsShowAlert] = useState(false);
  let jwt = localStorage.getItem("jwt");

  useEffect(() => {
    localStorage.removeItem("subtitles");
    localStorage.removeItem("subtitle");
    localStorage.removeItem("formAction");
    localStorage.removeItem("movie_src");
    localStorage.removeItem("lastSeasonFocus");
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    jwt = localStorage.getItem("jwt");
  }, [jwt]);

  const { data, error, isFetching } = useGetMovieQuery({ id });
  const {
    data: movieDetail,
    error: movieDetailError,
    isFetching: detailIsFetching,
  } = useGetMovieDetailQuery({ id });
  const {
    data: movieRecom,
    error: movieRecomError,
    isFetching: RecomIsFetching,
  } = useGetMovieRecomQuery({ id });

  useEffect(() => {
    localStorage.removeItem("lastFocusMore");
    if (localStorage.getItem("seasonBtn")) {
      console.log(localStorage.getItem("seasonBtn"));
      setFocus("season-btn");
    } else {
      if (
        localStorage.getItem("lastFocusActor") === null &&
        localStorage.getItem("lastFocusCrew") === null
      ) {
        window.scrollTo({ top: 0 });
        setFocus("paly-btn");
      } else if (localStorage.getItem("lastFocusActor")) {
        setFocus(localStorage.getItem("lastFocusActor"));
      } else {
        setFocus(localStorage.getItem("lastFocusCrew"));
      }
    }
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (localStorage.getItem("seasonBtn")) {
      console.log(localStorage.getItem("seasonBtn"));
      setFocus("season-btn");
    } else {
      if (
        localStorage.getItem("lastFocusActor") === null &&
        localStorage.getItem("lastFocusCrew") === null
      ) {
        window.scrollTo({ top: 0 });
        setFocus("paly-btn");
      } else if (localStorage.getItem("lastFocusActor")) {
        setFocus(localStorage.getItem("lastFocusActor"));
      } else {
        setFocus(localStorage.getItem("lastFocusCrew"));
      }
    }
  }, [location]);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      window.scrollTo({ top: 0 });
      navigate(-1);
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
      behavior: "smooth",
      block: "end",
    });
  };
  const handleSeasonBtnFocus = () => {
    seasonBtn.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  const handleRecommBtnFocus = () => {
    recommBtn.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  const handlePlayPress = () => {
    if (data?.data?.watch_action.link_text === "تمدید اشتراک") {
      setIsShowAlert(true);
      setTimeout(() => {
        setIsShowAlert(false);
      }, 2000);
    } else if (data?.data?.watch_action.link_text === "ورود و تماشا") {
      navigate("/login");
    } else if (data?.data?.watch_action.link_text === "ورود و خرید بلیت") {
      setIsShowAlert(true);
      setTimeout(() => {
        setIsShowAlert(false);
      }, 2000);
    } else if (data?.data?.watch_action.link_text === "خرید بلیت و تماشا") {
      setIsShowAlert(true);
      setTimeout(() => {
        setIsShowAlert(false);
      }, 2000);
    } else {
      localStorage.setItem(
        "subtitles",
        JSON.stringify(data.data.General?.subtitle?.data)
      );
      localStorage.setItem(
        "formAction",
        data.data?.watch_action?.visit_url?.formAction
      );

      localStorage.setItem("movie_src", data?.data?.watch_action.movie_src);

      navigate(`/player`);
    }
  };

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  return (
    <FocusContext.Provider value={focusKey}>
      <main className="main">
        {isShowAlert && <Alert />}

        <div
          style={{
            background:
              "linear-gradient(0deg, #151515 0%, rgba(21, 21, 21, 0.25) 30%, rgba(21, 21, 21, 0.00) 100%), linear-gradient(270deg, rgba(21, 21, 21, 0.80) 0%, rgba(21, 21, 21, 0.40) 28.12%, rgba(21, 21, 21, 0.00) 46.87%)",
          }}
          className="hero"
        >
          {/* <div className="hero-gradiant"></div> */}
          <img
            src={data?.data?.General?.cover_data.horizontal}
            className="hero-poster"
            // alt={data?.title}
          />
          <div className="hero-content">
            <div className="more-section-header">
              <img src={logo} className="logo-expended" />

              {/* <Focusable
              className="btn-back u700"
              onClickEnter={() => {
                navigate(-1);
              }}
            >
              <p>بازگشت</p>
            </Focusable> */}
            </div>
            <div className="hero-text">
              <h2 className="hero-text-title u700">
                {data?.data?.General?.title}
              </h2>
              <span className="hero-text-title-en u500">
                {data?.data?.General?.title_en}
              </span>
              <HeroBadge movie={data?.data?.General} />
              {data?.data?.General?.serial.enable === true ? (
                <div className="schedule">
                  <div className="calender">
                    <img src={calender} />
                    <span className="u500">
                      {data?.data?.General?.serial.season_id}
                    </span>
                    <span className="u500">فصل،</span>
                    <span className="u500">
                      {data?.data?.General?.serial.serial_part}
                    </span>
                    <span className="u500">قسمت</span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="hero-detail">
              <MovieDetailBadge movie={data?.data?.General} />
            </div>
            <div ref={myRef} className="hero-controls">
              <div style={{ display: "flex", width: "100%" }}>
                <PlayBotton
                  data={data}
                  onEnterPress={handlePlayPress}
                  onFocus={handleScrolling}
                />

                {/* <h3 className="u700">گزینه ها</h3> */}

                {data.data.General.pre_title === "سریال" && (
                  <div
                    style={{ width: "50%", marginLeft: "50px" }}
                    ref={seasonBtn}
                  >
                    <SeasonBtn
                      seriesName={data?.data?.General?.title}
                      ui_id={data?.data?.General.uid}
                      onFocus={handleSeasonBtnFocus}
                    />
                  </div>
                )}

                <div style={{ width: "50%" }} ref={recommBtn}>
                  <RecommBtn
                    movieRow={movieRecom?.data[0].movies.data}
                    onFocus={handleRecommBtnFocus}
                    linkText={"فیلم های پیشنهادی"}
                  />
                </div>
              </div>
            </div>
            <p className="hero-text-descr u400">
              {data?.data?.General.descr?.slice(0, 250)}
              {data?.data?.General.descr?.length >= 250 ? "..." : null}
            </p>
          </div>
        </div>
        {/* {!RecomIsFetching && movieRecom?.data && (
          <Recommendation movieRow={movieRecom?.data[0]} rowId={id} />
        )} */}

        {!detailIsFetching && movieDetail?.data?.ActorCrewData && (
          <Actors actorsRow={movieDetail?.data?.ActorCrewData?.profile} />
        )}

        <section style={{ marginRight: "40px" }} className="movie-description">
          <h3 className="u700">داستان</h3>
          <p className="movie-description-text u500">
            {stripHtmlTags(data?.data?.General.about_movie)}
          </p>
        </section>

        {!detailIsFetching && movieDetail?.data?.OtherCrewData && (
          <Crews crewRow={movieDetail?.data?.OtherCrewData} />
        )}
      </main>
    </FocusContext.Provider>
  );
}

export default MovieInfo;
