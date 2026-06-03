import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Content from "@src/components/Content/Content";
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

  const myRef = useRef(null);

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
    posterRows,
  } = useHomeMovies({ tag_id, other_data, jwt, pageConfig });

  const { scrollRef, onRowFocus } = useFocusInit({
    movies,
    data,
    pageConfig,
    pageType,
    other_data,
    location,
  });

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
          />
        </div>
      );
    });
  }, [filteredRows, jwt, lastMovieElement, movieSet, onRowFocus, scrollRef]);

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
            data={posterRows}
            currentFocusedMovie={currentFocusedMovie}
            type={other_data}
            firstRow={posterRows}
          />
        )}

        <div
          className={[
            "home-rows-wrapper",
            isKid ? "home-rows-wrapper--kids" : "",
            location.pathname === "/" && !isKid && showPoster ? "main-rows" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          ref={myRef}
        >
          {renderedRows}
        </div>
      </div>
    </main>
  );
}

export default Home;
