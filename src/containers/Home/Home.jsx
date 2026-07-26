import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Content from "@src/components/Content/Content";
import HeroSlider from "@src/components/HeroSlider/HeroSlider";
import NetworkError from "@src/components/NetworkError/NetworkError";
import Loader from "@src/components/Loader/Loader";
import Snackbar from "@src/components/Snackbar/Snackbar";
import { useAuth } from "@src/components/AuthProvider";
import { useOnlineStatus } from "@src/app/App";
import { useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";
import ContentRow from "@src/components/ContentRow";
import { getPageType, PAGE_TYPE_CONFIG } from "./homeUtils";
import { useBackNavigation } from "./hooks/useBackNavigation";
import { useHomeMovies } from "./hooks/useHomeMovies";
import { useFocusInit } from "./hooks/useFocusInit";
import HeroSliderDebugOverlay from "./components/HeroSliderDebugOverlay/HeroSliderDebugOverlay";
import "./Home.css";

function Home({ isLogin }) {
  const { jwt } = useAuth();
  const { isKid } = useOnlineStatus();
  useFocusable({ forceFocus: false, saveLastFocusedChild: false });

  const location = useLocation();
  const navigate = useNavigate();
  const { tag_id, other_data } = useParams();

  const pageType = useMemo(
    () => getPageType(location.pathname),
    [location.pathname],
  );
  const pageConfig = PAGE_TYPE_CONFIG[pageType];

  const [currentFocusedMovie, setCurrentFocusedMovie] = useState(null);
  const [showPoster, setShowPoster] = useState(true);
  const [heroMode, setHeroMode] = useState("movie");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const myRef = useRef(null);
  const didInitModeRef = useRef(false);

  const { showExitModal, setShowExitModal, backArmedRef } = useBackNavigation({
    location,
    navigate,
  });

  const {
    movies,
    data,
    error,
    isFetching,
    lastMovieElement,
    filteredRows,
    sliderSlides,
  } = useHomeMovies({ tag_id, other_data, jwt, pageConfig });

  const hasSlider =
    location.pathname === "/" && !isKid && (sliderSlides?.length ?? 0) > 0;

  const { scrollRef, onRowFocus } = useFocusInit({
    movies,
    data,
    pageConfig,
    pageType,
    other_data,
    location,
    hasSlider,
  });

  // Initialize hero mode once content is loaded: slider when a headerslider
  // row exists, otherwise the movie-poster hero (previous behavior).
  useEffect(() => {
    didInitModeRef.current = false;
  }, [location.pathname, other_data]);

  useEffect(() => {
    if (didInitModeRef.current) return;
    if (!movies?.data?.length) return;
    didInitModeRef.current = true;
    setHeroMode(hasSlider ? "slider" : "movie");
    setActiveSlideIndex(0);
  }, [movies, hasSlider]);

  useEffect(() => {
    if (data?.data) {
      setCurrentFocusedMovie(
        data.data.filter(
          (item) =>
            item.output_type === "movie" || item.output_type === "livetv",
        )[0]?.movies?.data[0],
      );
    }
  }, [data]);

  useEffect(() => {
    setCurrentFocusedMovie(null);
  }, [other_data]);

  const movieSet = useCallback(
    (movieUid, focusKeey) => {
      setCurrentFocusedMovie(movieUid);
      setHeroMode("movie");

      if (focusKeey) {
        if (focusKeey.slice(6, 7) === "0" && !isKid) {
          setShowPoster(true);
        } else {
          setShowPoster(false);
        }
      }
    },
    [isKid],
  );

  const onEnterPlay = useCallback(
    (slide) => {
      if (!slide) return;
      const linkKey = slide.link_key || slide.btns?.[0]?.link_key;
      const linkType = slide.link_type || slide.btns?.[0]?.link_type;
      if (linkType === "movie" && linkKey) {
        navigate(`/movie/${linkKey}`);
      }
    },
    [navigate],
  );

  const heroBgSrc =
    heroMode === "slider"
      ? sliderSlides[activeSlideIndex]?.cover_desktop?.[0] ||
        sliderSlides[activeSlideIndex]?.cover?.[0]
      : currentFocusedMovie?.cover_data?.horizontal;

  const renderedRows = useMemo(() => {
    return filteredRows.map((movieItem, index) => {
      const isLastRow = index === filteredRows.length - 1;
      const rowKey =
        movieItem.link_key ||
        movieItem.tag_id ||
        `${movieItem.output_type}-${index}`;
      const isMovieRow = movieItem.output_type === "movie";
      const isLiveTvRow = movieItem.output_type === "livetv";
      const movieData = isMovieRow
        ? movieItem.movies?.data
        : movieItem.livetvs?.data;

      if (!movieData) return null;
      if (isLiveTvRow && !jwt) return null;

      return (
        <div key={rowKey} ref={isLastRow ? lastMovieElement : null}>
          <ContentRow
            title={movieItem.link_text}
            movieFocused={movieSet}
            movies={movieData}
            focusKeey={`MOVIE_LIST_${index}`}
            index={index}
            movieLinkKey={movieItem.link_key}
            movieTag={movieItem.tag_id}
            onFocus={onRowFocus}
            row={movieItem.link_key ? movieItem.link_key : movieItem.tag_id}
            scrollRef={scrollRef}
            hasSlider={hasSlider}
          />
        </div>
      );
    });
  }, [
    filteredRows,
    jwt,
    lastMovieElement,
    movieSet,
    onRowFocus,
    scrollRef,
    hasSlider,
  ]);

  if (error) return <NetworkError />;
  if (isFetching) return <Loader />;
  if (!data?.data?.length) return <NetworkError />;

  return (
    <main className="main">
      {showExitModal && (
        <Snackbar
          onExit={() => {
            backArmedRef.current = false;
            setShowExitModal(false);
            setFocus("menuItem__0");
          }}
        />
      )}

      <div ref={scrollRef} className="home-scroll-container">
        {!isKid && location.pathname === "/" && showPoster && (
          <Content
            bgSrc={heroBgSrc}
            currentFocusedMovie={currentFocusedMovie}
            mode={heroMode}
          >
            {hasSlider && (
              <HeroSlider
                slides={sliderSlides}
                activeIndex={activeSlideIndex}
                setActiveIndex={setActiveSlideIndex}
                onEnterPlay={onEnterPlay}
                onDownToRows={() => setFocus("MOVIE_0__0")}
                onFocusModeSlider={() => {
                  setHeroMode("slider");
                  // Returning to the slider must reset the scroll the rows
                  // introduced, otherwise the hero stays partially scrolled up.
                  scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
                hidden={heroMode !== "slider"}
              />
            )}
          </Content>
        )}

        <div
          className={[
            "home-rows-wrapper",
            isKid ? "home-rows-wrapper--kids" : "",
            location.pathname === "/" && !isKid && showPoster ? "main-rows" : "",
            hasSlider && heroMode === "slider"
              ? "home-rows-wrapper--hero-slider"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          ref={myRef}
        >
          {renderedRows}
        </div>
      </div>

      {location.pathname === "/" && !isKid && (
        <HeroSliderDebugOverlay sliderSlides={sliderSlides} data={data} />
      )}
    </main>
  );
}

export default Home;
