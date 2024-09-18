import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import { useGetMoreMoviesQuery } from "../../services/TMDB";
import Movie from "../Movie/Movie.jsx";
import NetworkError from "../NetworkError/NetworkError.jsx";
import Loader from "../Loader/Loader.jsx";
import { MovieList } from "../index";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import ContentRow from "../ContentRow.jsx";
import ContentMoreRow from "../ContentMoreRow.jsx";
import MovieSearch from "../Movie/MovieSearch.jsx";

const MoreMovies = () => {
  const location = useLocation();
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left"],
  });
  const { tag_id } = useParams();
  const myRef = useRef(null);

  const navigate = useNavigate();
  const { data, error, isFetching } = useGetMoreMoviesQuery({ tag_id });
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

  const onRowFocus = React.useCallback(
    // ({ y }) => {
    //   ref.current.style.scrollBehavior = "smooth";

    //   if (event) {
    //     if (event.key === "ArrowDown") {
    //       ref.current.scrollTop += 300;
    //     } else if (event.key === "ArrowUp") {
    //       ref.current.scrollTop -= 300;
    //     }
    //   }
    //   console.log(ref.current.scrollTop);
    //   console.log("focus");

    //   // ref.current.scrollTo({
    //   //   top: y,
    //   //   behavior: "smooth",
    //   // });
    //   // console.log(ref.current.scrollTop);
    //   // ref.current.scrollTop += 10;
    //   // console.log(ref.current.scrollTop);
    //   // ref.current.style.scrollBehavior = "smooth";
    // },
    ({ y }) => {
      myRef.current.scrollTo({
        top: y,
      });
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

  if (error) return <NetworkError errorText="دیتایی یافت نشد" />;

  if (isFetching) return <Loader />;

  if (!data.data.find((obj) => obj.output_type === "movie")?.link_text)
    return <NetworkError errorText="دیتایی یافت نشد" />;

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
      <FocusContext.Provider value={focusKey}>
        {/* <div className="more">
          <h1 className="u700">
            {
              data.data.filter((obj) => obj.output_type === "movie")[0]
                .link_text
            }
          </h1>
          <div className="more-movies">
            {data.data
              .filter((obj) => obj.output_type === "movie")[0]
              .movies?.data.map((movieItem, index) => (
                <MovieSearch
                  movie={movieItem}
                  movieFocus={movieFocusSet}
                  focusKeey={`MORE_LIST_${index}`}
                />
              ))}
          </div>
        </div> */}

        <div
          ref={myRef}
          style={{
            paddingRight: "40px",
            height: "3000px",
            width: "100%",
            background:
              "linear-gradient(270deg, #151515 0%, rgba(17, 17, 17, 0.75) 50.79%, rgba(12, 12, 12, 0) 100%), linear-gradient(180deg, rgba(21, 21, 21, 0) 67.35%, #151515 100%)",
          }}
        >
          {data.data
            .filter((item) => item.output_type === "movie")
            .map((movieItem, index) => (
              <div>
                <h3 className="u700">{movieItem.link_text}</h3>
                <ContentMoreRow
                  movieFocused={movieFocusSet}
                  row={movieItem.link_key}
                  movies={movieItem.movies.data}
                  focusKeey={`MOVIE_LIST_${index}`}
                  index={index}
                />
              </div>
            ))}
        </div>
      </FocusContext.Provider>

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

export default MoreMovies;
