import React, { useImperativeHandle, forwardRef } from "react";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useGetMovieRecomQuery } from "@src/services/TMDB";
import MovieSearch from "@src/components/Movie/MovieSearch.jsx";
import Loader from "@src/components/Loader/Loader";
import NetworkError from "@src/components/NetworkError/NetworkError";

const RecommPanel = forwardRef(({ id }, ref) => {
  const {
    data: movieRecom,
    error,
    isFetching,
  } = useGetMovieRecomQuery({ id });

  useImperativeHandle(ref, () => ({
    focusFirst: () => setFocus("MORE_LIST_0"),
  }));

  if (isFetching) return <Loader />;
  if (error) return <NetworkError errorText="دیتایی یافت نشد" />;

  const row = movieRecom?.data?.[0];
  if (!row?.movies?.data?.length)
    return <NetworkError errorText="دیتایی یافت نشد" />;

  return (
    <div className="movieinfo-recomm-panel more">
      <h1 className="u700">{row.link_text}</h1>
      <div className="more-movies">
        {row.movies.data.map((movieItem, index) => (
          <MovieSearch
            key={movieItem.uid || index}
            movie={movieItem}
            movieFocus={() => {}}
            focusKeey={`MORE_LIST_${index}`}
          />
        ))}
      </div>
    </div>
  );
});

export default RecommPanel;
