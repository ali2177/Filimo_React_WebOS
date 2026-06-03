import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetMoviesQuery } from "../../services/TMDB";
import Content from "../Content/Content";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import Snackbar from "../Snackbar/Snackbar";
import { useAuth } from "../AuthProvider";
import { useOnlineStatus } from "../App";
import {
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import ContentRow from "../ContentRow";

const STORAGE_KEYS_TO_CLEAR_ON_ENTER = [
  "searchQuery",
  "searchResult",
  "level",
  "lastCatFocus",
  "lastFocusMore",
  "last",
  "lastFocusActor",
  "lastFocusCrew",
  "lastFocusRecomm",
  "lastFocusCat",
  "lastFocusMoreMovie_level__1",
  "lastFocusMoreMovie_level__2",
  "lastFocusMore_level__1",
  "lastFocusMore_level__2",
  "seasonBtn",
  "recommBtn",
  "moreBtn",
  "lastSeasonFocus",
  "lastSeasonFocus_parent_new",
  "lastSeasonFocus_season_part",
  "movie_cast_time",
  "movie_uid",
  "fromAlert",
];

const PAGE_TYPE_CONFIG = {
  home: {
    cacheKey: "lastdataloaded",
    focusRowBeforeReloadKey: "lastFocusRowBeforeReload",
  },
  series: {
    cacheKey: "lastdataloadedSeries",
    focusRowBeforeReloadKey: "lastFocusRowSeriesBeforeReload",
  },
  movie: {
    cacheKey: "lastdataloadedMovies",
    focusRowBeforeReloadKey: "lastFocusRowMoviesBeforeReload",
  },
  iran: {
    cacheKey: "lastdataloadedIran",
    focusRowBeforeReloadKey: "lastFocusRowIranBeforeReload",
  },
  kids: {
    cacheKey: "lastdataloadedKids",
    focusRowBeforeReloadKey: "lastFocusRowKidsBeforeReload",
  },
};

function getPageType(pathname) {
  if (pathname === "/") return "home";
  if (pathname.includes("/series")) return "series";
  if (pathname.includes("/movie")) return "movie";
  if (pathname.includes("/iran")) return "iran";
  if (pathname.includes("/kids")) return "kids";
  return "other";
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function Movies({ isLogin }) {
  const { jwt } = useAuth();
  const { isKid } = useOnlineStatus();
  useFocusable({
    forceFocus: false,
    saveLastFocusedChild: false,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { tag_id, other_data } = useParams();

  const pageType = useMemo(
    () => getPageType(location.pathname),
    [location.pathname]
  );
  const pageConfig = PAGE_TYPE_CONFIG[pageType];

  const [scrolling, setScrolling] = useState(false);
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);
  const [movies, setMovies] = useState(null);
  const [pageLocation, setPageLocation] = useState();
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [isNewDataLoading, setIsNewDataLoading] = useState(false);

  const myRef = useRef(null);
  const scrollRef = useRef(null);
  const observer = useRef(null);
  const didInitFocusRef = useRef(false);
  const backArmedRef = useRef(false);
  const backTimerRef = useRef(null);

  const { data, error, isFetching } = useGetMoviesQuery({
    tag_id,
    other_data,
    jwt,
  });

  const filteredRows = useMemo(() => {
    if (!movies?.data) return [];

    return movies.data.filter(
      (item) =>
        (item.output_type === "movie" || item.output_type === "livetv") &&
        item.link_text !== null &&
        item.link_text !== ""
    );
  }, [movies]);

  const posterRows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((item) => item.output_type === "movie");
  }, [data]);

  const isBackKey = useCallback((e) => {
    return e.keyCode === 461 || e.keyCode === 8 || e.keyCode === 10009;
  }, []);

  const armBack = useCallback(() => {
    backArmedRef.current = true;
    clearTimeout(backTimerRef.current);
    setShowExitModal(true);
    // backTimerRef.current = setTimeout(() => {
    //   backArmedRef.current = false;
    //   setShowExitModal(false);
    // }, 3000);
  }, []);

  const onRowFocus = useCallback(({ y }) => {
    myRef.current?.scrollTo({ top: y });
  }, []);

  const movieSet = useCallback(
    (movieUid, focusKeey) => {
      setCurretFocusedMovie(movieUid);

      if (focusKeey) {
        if (focusKeey.slice(6, 7) === "0" && !isKid) {
          setShowPoster(true);
        } else {
          setShowPoster(false);
        }
      }
    },
    [isKid]
  );

  const keyHandler = useCallback(
    (e) => {
      if (!isBackKey(e)) return;

      e.preventDefault?.();
      e.stopPropagation?.();

      if (location.pathname === "/") {
        const currentFocusKey = getCurrentFocusKey?.() || "";

        if (!currentFocusKey.includes("menuItem_")) {
          if (!showExitModal) {
            setFocus("menuItem__0");
            // armBack();
            return;
          }
        }

        if (!backArmedRef.current) {
          armBack();
          return;
        }

        return;
      }

      if (location.pathname !== "/player") {
        navigate(-1);
      }
    },
    [armBack, isBackKey, location.pathname, navigate, showExitModal]
  );

  const persistMoviesToStorage = useCallback(
    (nextMovies) => {
      if (!pageConfig) return;
      localStorage.setItem(pageConfig.cacheKey, JSON.stringify(nextMovies));
    },
    [pageConfig]
  );

  const handlePaginationResult = useCallback(
    (result) => {
      setMovies((prevMovies) => {
        if (!prevMovies) return prevMovies;

        const nextMovies = {
          ...prevMovies,
          links: result?.links,
          data: [...prevMovies.data, ...result.data],
        };

        if (pageConfig) {
          localStorage.setItem(
            pageConfig.focusRowBeforeReloadKey,
            localStorage.getItem("lastFocusRow") || ""
          );
          persistMoviesToStorage(nextMovies);
        }

        return nextMovies;
      });
    },
    [pageConfig, persistMoviesToStorage]
  );

  const lastMovieElement = useCallback(
    (node) => {
      if (isFetching || !node) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (!movies?.links?.forward) return;
        if (isNewDataLoading) return;

        const headers = new Headers();
        if (jwt) {
          headers.append("Authorization", `Bearer ${jwt}`);
        }

        const requestOptions = {
          method: "GET",
          redirect: "follow",
          ...(jwt ? { headers } : {}),
        };

        setIsNewDataLoading(true);

        fetch(`${movies.links.forward}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            handlePaginationResult(result);
            setIsNewDataLoading(false);
          })
          .catch((fetchError) => {
            console.log("error", fetchError);
            setIsNewDataLoading(false);
          });
      });

      observer.current.observe(node);
    },
    [handlePaginationResult, isFetching, jwt, movies]
  );

  useEffect(() => {
    setPageLocation(location.pathname);

    STORAGE_KEYS_TO_CLEAR_ON_ENTER.forEach((key) => {
      localStorage.removeItem(key);
    });

    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, [keyHandler, location.pathname]);

  useEffect(() => {
    didInitFocusRef.current = false;
  }, [location.pathname, other_data]);

  useEffect(() => {
    if (!pageConfig) {
      if (data) setMovies(data);
      return;
    }

    const cached = safeParse(localStorage.getItem(pageConfig.cacheKey));
    if (cached?.data) {
      setMovies(cached);
    } else if (data) {
      setMovies(data);
    }

    if (data?.data) {
      setCurretFocusedMovie(
        data.data.filter(
          (item) =>
            item.output_type === "movie" || item.output_type === "livetv"
        )[0]?.movies?.data[0]
      );
    }
  }, [data, pageConfig]);

  useEffect(() => {
    if (!movies?.data?.length) return;
    if (!data?.data?.[0]) return;
    if (didInitFocusRef.current) return;

    didInitFocusRef.current = true;

    const lastFocus = localStorage.getItem("lastFocus");
    if (lastFocus) {
      setFocus(lastFocus);
      return;
    }

    if (pageConfig?.focusRowBeforeReloadKey) {
      const savedRow = localStorage.getItem(pageConfig.focusRowBeforeReloadKey);
      if (savedRow) {
        setFocus(`${savedRow}__0`);
        return;
      }
    }

    if (pageType === "series") {
      const lastMovieFocus = localStorage.getItem("lastMovieFocus");
      if (lastMovieFocus) {
        setFocus(lastMovieFocus);
        return;
      }
    }

    setFocus("MOVIE_0__0");
  }, [data, movies, pageConfig, pageType]);

  useEffect(() => {
    setCurretFocusedMovie(null);
  }, [other_data]);

  useEffect(() => {
    const handleBlockingKeyDown = (e) => {
      if (isNewDataLoading) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleBlockingKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleBlockingKeyDown, true);
    };
  }, [isNewDataLoading]);

  useEffect(() => {
    return () => {
      clearTimeout(backTimerRef.current);
      observer.current?.disconnect();
    };
  }, []);

  const renderRows = () => {
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
  };

  if (error) {
    return <NetworkError />;
  }

  if (isFetching) return <Loader />;

  if (!data?.data?.length) {
    return <NetworkError />;
  }

  return (
    <main className={scrolling ? "main no-pointer" : "main"}>
      {showExitModal && (
        <Snackbar
          onExit={() => {
            backArmedRef.current = false;
            setShowExitModal(false);
            setFocus("menuItem__0");
          }}
        />
      )}

      <div
        ref={scrollRef}
        style={{
          overflow: "hidden",
          overflowY: "scroll",
          height: "100vh",
        }}
      >
        {!isKid && pageLocation === "/" && showPoster && (
          <Content
            data={posterRows}
            curretFocusedMovie={curretFocusedMovie}
            type={other_data}
            firstRow={posterRows}
          />
        )}

        <div
          className={
            pageLocation === "/" && !isKid && showPoster ? "main-rows" : ""
          }
          ref={myRef}
          style={{
            paddingTop: isKid ? "1.54rem" : "1.44rem",
            marginRight: "1.54rem",
            position: "relative",
            zIndex: "999999",
          }}
        >
          {renderRows()}
        </div>
      </div>
    </main>
  );
}

export default Movies;
