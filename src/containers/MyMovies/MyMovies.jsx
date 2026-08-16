import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBackKey } from "@src/hooks/useBackKey";
import { useGetMyMovieQuery } from "../../services/TMDB";
import ContentRow from "@src/components/ContentRow";
import { useFocusInit } from "@src/containers/Home/hooks/useFocusInit";
import NetworkError from "@src/components/NetworkError/NetworkError";
import Loader from "@src/components/Loader/Loader";
import "@src/containers/Home/Home.css";

const MyMovies = ({ isLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  let jwt = localStorage.getItem("jwt");

  const handleBack = useCallback(() => {
    if (window.location.pathname !== "/player") navigate(-1);
  }, [navigate]);
  useBackKey(handleBack);

  const [, setCurrentFocusedMovie] = useState(null);
  const movieSet = useCallback((movieUid) => {
    setCurrentFocusedMovie(movieUid);
  }, []);

  useEffect(() => {
    jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/");
    }
  }, [isLogin]);

  const { data, error, isFetching } = useGetMyMovieQuery();

  // Reuse Home's focus/scroll bootstrap: restores lastFocus or lands on
  // MOVIE_0__0, and drives keyboard-mode scroll-into-view via scrollRef.
  const { scrollRef, onRowFocus } = useFocusInit({
    movies: data,
    data,
    pageConfig: undefined,
    pageType: undefined,
    other_data: undefined,
    location,
    hasSlider: false,
  });

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  // Keep only sections that have a title and at least one item (mirrors the
  // old link_text != null guard, plus a check for empty rows).
  const sections = (data?.data ?? []).filter(
    (item) => item.link_text != null && item.movies?.data?.length,
  );

  if (!sections.length) return <NetworkError />;

  return (
    <main className="main">
      <div ref={scrollRef} className="home-scroll-container">
        <div className="home-rows-wrapper">
          {sections.map((movieItem, index) => (
            <div key={movieItem.link_key ?? index}>
              <ContentRow
                title={movieItem.link_text}
                movies={movieItem.movies.data}
                movieFocused={movieSet}
                focusKeey={`MOVIE_LIST_${index}`}
                index={index}
                row={movieItem.link_key}
                onFocus={onRowFocus}
                scrollRef={scrollRef}
                hasSlider={false}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyMovies;
