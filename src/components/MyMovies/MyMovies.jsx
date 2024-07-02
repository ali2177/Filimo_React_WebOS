import React, { useEffect, useState } from "react";
import { Focusable } from "react-js-spatial-navigation";
import { useGetMyMovieQuery } from "../../services/TMDB";
import { MovieList } from "../index";
import Content from "../Content/Content";
import { useNavigate } from "react-router-dom";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";

const MyMovies = ({ isLogin }) => {
  const navigate = useNavigate();
  let jwt = localStorage.getItem("jwt");
  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      navigate(-1);
    }
  };

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
