import React, { useEffect, useState, useCallback } from "react";
import { useBackKey } from "@src/hooks/useBackKey";
import { Focusable } from "react-js-spatial-navigation";
import { useGetMyMovieQuery } from "../../services/TMDB";
import MovieList from "@src/components/MovieList/MovieList";
import Content from "@src/components/Content/Content";
import { useNavigate } from "react-router-dom";
import NetworkError from "@src/components/NetworkError/NetworkError";
import Loader from "@src/components/Loader/Loader";

const MyMovies = ({ isLogin }) => {
  const navigate = useNavigate();
  let jwt = localStorage.getItem("jwt");
  const handleBack = useCallback(() => {
    if (window.location.pathname !== "/player") navigate(-1);
  }, [navigate]);

  useBackKey(handleBack);

  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);
  const movieSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  useEffect(() => {
    jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/");
    }
  }, [isLogin]);

  const { data, error, isFetching } = useGetMyMovieQuery();

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  return (
    <>
      <main className="main">
        <div style={{ marginRight: "40px", marginBottom: "50px" }}>
          {data.data.map((movieItem) =>
            movieItem.link_text != null ? (
              <div style={{ marginBottom: "100px" }}>
                <h3 className="u700">{movieItem.link_text}</h3>

                <MovieList
                  movieFocused={movieSet}
                  row={movieItem.link_key}
                  movies={movieItem.movies.data}
                />
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </main>
    </>
  );
};

export default MyMovies;
