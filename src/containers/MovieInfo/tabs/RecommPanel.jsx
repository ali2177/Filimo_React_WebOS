import React, { useImperativeHandle, forwardRef } from "react";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useGetMovieRecomQuery } from "@src/services/TMDB";
import MovieSearch from "@src/components/Movie/MovieSearch.jsx";
import Loader from "@src/components/Loader/Loader";
import NetworkError from "@src/components/NetworkError/NetworkError";

// Must match grid-template-columns in .movieinfo-recomm-panel .more-movies.
const COLUMNS = 6;

const RecommPanel = forwardRef(({ id, onExitUp }, ref) => {
  const { data: movieRecom, error, isFetching } = useGetMovieRecomQuery({ id });

  useImperativeHandle(ref, () => ({
    focusFirst: () => setFocus("MORE_LIST_0"),
  }));

  if (isFetching) return <Loader />;
  if (error) return <NetworkError errorText="دیتایی یافت نشد" />;

  const row = movieRecom?.data?.[0];
  if (!row?.movies?.data?.length)
    return <NetworkError errorText="دیتایی یافت نشد" />;

  return (
    <div className="movieinfo-recomm-panel" data-scroll-boundary>
      <div className="allepisode-content-wrapper">
        <div className="more-movies">
          {row.movies.data.map((movieItem, index) => (
            <MovieSearch
              key={movieItem.uid || index}
              movie={movieItem}
              movieFocus={() => {}}
              focusKeey={`MORE_LIST_${index}`}
              // First row: up-arrow leaves the poster grid and returns focus to
              // the tab strip (there is nothing focusable above it in the panel).
              onArrowPress={
                index < COLUMNS
                  ? (direction) => {
                      if (direction === "up") {
                        onExitUp?.();
                        return false;
                      }
                      return true;
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default RecommPanel;
