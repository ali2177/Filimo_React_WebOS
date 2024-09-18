import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import NetworkError from "../NetworkError/NetworkError.jsx";
import Loader from "../Loader/Loader.jsx";
import { MovieList } from "../index";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

import { useGetMovieRecomQuery } from "../../services/TMDB";
import MovieSearch from "../Movie/MovieSearch.jsx";

const MoreReccom = () => {
  const location = useLocation();
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left"],
  });
  const { id } = useParams();
  const {
    data: movieRecom,
    error: movieRecomError,
    isFetching: RecomIsFetching,
  } = useGetMovieRecomQuery({ id });

  const navigate = useNavigate();

  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    window.scrollTo({ top: 0 });
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  // useEffect(() => {
  //   console.log(focusKey);
  //   focusSelf();
  // }, []);
  // useEffect(() => {
  //   focusSelf();
  // }, [location]);
  useEffect(() => {
    setFocus("MORE_LIST_0");
  }, []);

  const onRowFocus = React.useCallback(
    ({ y }) => {
      if (event) {
        if (event.key === "ArrowDown") {
          ref.current.scrollTop += 300;
        } else if (event.key === "ArrowUp") {
          ref.current.scrollTop -= 300;
        }
      }

      // ref.current.scrollTo({
      //   top: y,
      //   behavior: "smooth",
      // });
      // console.log(ref.current.scrollTop);
      // ref.current.scrollTop += 10;
      // console.log(ref.current.scrollTop);
      // ref.current.style.scrollBehavior = "smooth";
    },
    [ref]
  );

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      navigate(-1);
    }
  };

  if (movieRecomError) return <NetworkError errorText="دیتایی یافت نشد" />;

  if (RecomIsFetching) return <Loader />;

  return (
    <>
      {/* <div
        ref={ref}
        style={{
          paddingTop: "30px",
          marginRight: "30px",
          overflow: "hidden",
          overflowY: "scroll",
          height: "100vh",
        }}
        className="more-section"
      >
        {data.data
          .filter((item) => item.output_type === "movie")
          .map((movieItem, index) => (
            <div>
              <h3 className="u700">{movieItem.link_text}</h3>
              <ContentRow
                movieFocused={movieFocusSet}
                row={movieItem.link_key}
                movies={movieItem.movies.data}
                focusKeey={`MOVIE_LIST_${index}`}
                index={index}
                onFocus={onRowFocus}
              />
            </div>
          ))} */}

      <div className="more">
        <h1>{movieRecom.data[0].link_text}</h1>
        <div className="more-movies">
          {movieRecom.data[0].movies?.data.map((movieItem, index) => (
            <MovieSearch
              movie={movieItem}
              movieFocus={movieFocusSet}
              focusKeey={`MORE_LIST_${index}`}
            />
          ))}
        </div>
      </div>

      {/* {data.data.filter((item) => item.output_type === "movie").length === 1 ? (
        <>
          <div className="more">
            <h1>{data.data[0].link_text}</h1>
            <div className="more-movies">
              {data.data[0].movies?.data.map((movieItem, index) => (
                <MovieSearch
                  movie={movieItem}
                  movieFocus={movieFocusSet}
                  focusKeey={`MORE_LIST_${index}`}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <FocusContext.Provider value={focusKey}>
          <div
            ref={ref}
            style={{
              paddingTop: "30px",
              marginRight: "30px",
              overflow: "hidden",
              overflowY: "scroll",
              height: "100vh",
            }}
            className="more-section"
          >
            {data.data
              .filter((item) => item.output_type === "movie")
              .map((movieItem, index) => (
                <div>
                  <h3 className="u700">{movieItem.link_text}</h3>
                  <ContentRow
                    movieFocused={movieFocusSet}
                    row={movieItem.link_key}
                    movies={movieItem.movies.data}
                    focusKeey={`MOVIE_LIST_${index}`}
                    index={index}
                    onFocus={onRowFocus}
                  />
                </div>
              ))}
          </div>
        </FocusContext.Provider>
      )} */}
    </>
  );
};

export default MoreReccom;
