import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import { useGetMoreMoviesQuery } from "../../services/TMDB";
import Movie from "../Movie/Movie.jsx";
import NetworkError from "../NetworkError/NetworkError.jsx";
import MovieMore from "../Movie/MovieMore.jsx";
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
import { useAuth } from "../AuthProvider";
import { useOnlineStatus } from "../App";
import ContentRow from "../ContentRow.jsx";
import ContentMoreRow from "../ContentMoreRow.jsx";
import MovieSearch from "../Movie/MovieSearch.jsx";

const MoreMovies = () => {
  const { jwt, setJwt } = useAuth();
  const { isOnline, isKid } = useOnlineStatus();
  const location = useLocation();
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });
  const { tag_id } = useParams();
  const myRef = useRef(null);
  const observer = useRef();

  const navigate = useNavigate();
  const [movies, setMovies] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [movieList, setMovieList] = useState(null);
  const { data, error, isFetching } = useGetMoreMoviesQuery({ tag_id });
  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");

  useEffect(() => {
    localStorage.removeItem("lastFocusActor");
    localStorage.removeItem("lastFocusCrew");
    localStorage.removeItem("last");
    localStorage.removeItem("lastFocusMoreMovie");
    localStorage.removeItem("lastFocusMore");
    window.addEventListener("keydown", keyHandler);
    // window.scrollTo({ top: 0 });
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, [location]);
  useEffect(() => {
    if (isFetching) {
      setIsLoading(true);
    }
  }, [isFetching]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLoading) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isLoading]);
  useEffect(() => {
    if (data) {
      setMovies(data.data.filter((item) => item.output_type === "movie")[0]);
      setMovieList(
        data.data.filter((item) => item.output_type === "movie")[0].movies.data
      );
      if (
        data.data.filter((item) => item.output_type === "movie").length === 1
      ) {
        localStorage.setItem(
          "forward_link",
          data.data.filter((item) => item.output_type === "movie")[0]?.links
            ?.next
        );
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    }
  }, [data]);
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

  const lastMovieElement = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          var myHeaders = new Headers();
          // console.log(entries[0].isIntersecting);
          if (jwt) {
            myHeaders.append("Authorization", `Bearer ${jwt}`);
            var requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };
          } else {
            var requestOptions = {
              method: "GET",
              redirect: "follow",
            };
          }
          if (movies) {
            if (movies?.links?.more_records) {
              fetch(`${localStorage.getItem("forward_link")}`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  if (result.data.length) {
                    setMovies(
                      result.data.filter(
                        (item) => item.output_type === "movie"
                      )[0]
                    );
                    setMovieList((prevMovieList) => [
                      ...prevMovieList,
                      ...result.data.filter(
                        (item) => item.output_type === "movie"
                      )[0]?.movies?.data,
                    ]);
                    localStorage.setItem(
                      "forward_link",
                      result.data.filter(
                        (item) => item.output_type === "movie"
                      )[0]?.links?.next
                    );
                  }
                })
                .catch((error) => console.log("error", error));
            }
          }

          // if (movies?.links?.forward) {
          //   fetch(`${movies?.links?.forward}`, requestOptions)
          //     .then((response) => response.json())
          //     .then((result) => {
          //       setMovies((prevmovies) => ({
          //         ...prevmovies,
          //         links: result?.links,
          //         data: [...prevmovies.data, ...result.data],
          //       }));
          //        if (location.pathname === "/") {
          //          localStorage.setItem(
          //            "lastFocusRowBeforeReload",
          //            localStorage.getItem("lastFocusRow")
          //          );
          //          setTimeout(() => {
          //            localStorage.setItem(
          //              "lastdataloaded",
          //              JSON.stringify({
          //                ...movies,
          //                links: result?.links,
          //                data: [...movies.data, ...result.data],
          //              })
          //            );
          //          }, 3000);
          //        }
          //        if (location.pathname.slice(16) === "/series") {
          //          localStorage.setItem(
          //            "lastFocusRowSeriesBeforeReload",
          //            localStorage.getItem("lastFocusRow")
          //          );
          //          setTimeout(() => {
          //            localStorage.setItem(
          //              "lastdataloadedSeries",
          //              JSON.stringify({
          //                ...movies,
          //                links: result?.links,
          //                data: [...movies.data, ...result.data],
          //              })
          //            );
          //          }, 3000);
          //        }
          //        if (location.pathname.slice(16) === "/movie") {
          //          localStorage.setItem(
          //            "lastFocusRowMoviesBeforeReload",
          //            localStorage.getItem("lastFocusRow")
          //          );
          //          setTimeout(() => {
          //            localStorage.setItem(
          //              "lastdataloadedMovies",
          //              JSON.stringify({
          //                ...movies,
          //                links: result?.links,
          //                data: [...movies.data, ...result.data],
          //              })
          //            );
          //          }, 3000);
          //        }
          //        if (location.pathname.slice(16) === "/iran") {
          //          localStorage.setItem(
          //            "lastFocusRowIranBeforeReload",
          //            localStorage.getItem("lastFocusRow")
          //          );
          //          setTimeout(() => {
          //            localStorage.setItem(
          //              "lastdataloadedIran",
          //              JSON.stringify({
          //                ...movies,
          //                links: result?.links,
          //                data: [...movies.data, ...result.data],
          //              })
          //            );
          //          }, 3000);
          //        }
          //        if (location.pathname.slice(16) === "001215/kids") {
          //          localStorage.setItem(
          //            "lastFocusRowKidsBeforeReload",
          //            localStorage.getItem("lastFocusRow")
          //          );
          //          setTimeout(() => {
          //            localStorage.setItem(
          //              "lastdataloadedKids",
          //              JSON.stringify({
          //                ...movies,
          //                links: result?.links,
          //                data: [...movies.data, ...result.data],
          //              })
          //            );
          //          }, 3000);
          //        }
          //     })
          //     .catch((error) => console.log("error", error));
          // }
        }
      });
      if (node) observer.current.observe(node);
    },
    [movies]
  );

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      if (localStorage.getItem("level") === "level__2") {
        localStorage.removeItem("lastFocusMoreMovie_level__2");
        localStorage.removeItem("lastFocusMore_level__2");
      }
      if (localStorage.getItem("level")) {
        localStorage.setItem(
          "level",
          `level__${Number(localStorage.getItem("level").slice(7, 8)) - 1}`
        );
      }
      if (location.pathname !== "/player") navigate(-1);
    }
  };

  useEffect(() => {
    // window.scrollTo(0, 0);

    // if (data) {
    if (
      data?.data.filter((item) => item.output_type === "movie").length === 1
    ) {
      setFocus("MOVIEMore_0");
    } else {
      setFocus("MOVIEMore_0_0");
    }
    //   // if (localStorage.getItem("last")) {
    //   //   setFocus(localStorage.getItem("last"));
    //   // } else {
    //   //   setFocus("movieSearch_0");
    //   // }
    // }
    // focusSelf();
  }, [location]);
  useEffect(() => {
    // window.scrollTo(0, 0);

    // if (data) {
    if (
      data?.data.filter((item) => item.output_type === "movie").length === 1
    ) {
      setFocus("MOVIEMore_0");
    } else {
      setFocus("MOVIEMore_0_0");
    }
    //   // if (localStorage.getItem("last")) {
    //   //   setFocus(localStorage.getItem("last"));
    //   // } else {
    //   //   setFocus("movieSearch_0");
    //   // }
    // }
    // focusSelf();
  }, [data]);

  if (error)
    return <NetworkError errorText="در لیست شما فیلم یا سریالی وجود ندارد" />;

  if (isLoading) {
    return <Loader />;
  } else {
    if (!data?.data.find((obj) => obj.output_type === "movie"))
      return <NetworkError errorText="در لیست شما فیلم یا سریالی وجود ندارد" />;
  }

  if (movieList && movies) {
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
              paddingTop:
                data.data.filter((item) => item.output_type === "movie")
                  .length === 1
                  ? "30px"
                  : "0px",
              paddingRight:
                data.data.filter((item) => item.output_type === "movie")
                  .length === 1
                  ? "0px"
                  : "40px",

              width: "100%",
              height: "100vh",
              overflowY: "auto",
              background:
                "linear-gradient(270deg, #151515 0%, rgba(17, 17, 17, 0.75) 50.79%, rgba(12, 12, 12, 0) 100%), linear-gradient(180deg, rgba(21, 21, 21, 0) 67.35%, #151515 100%)",
            }}
          >
            {data.data.filter((item) => item.output_type === "movie").length !==
            1 ? (
              <>
                {data.data
                  .filter(
                    (item) => item.output_type === "movie" && item.link_text
                  )
                  .map((movieItem, index) => (
                    <div>
                      <h3
                        style={{
                          paddingTop: "0px",
                          margin: "12px 12px 0px 0px",
                        }}
                        className="u700"
                      >
                        {movieItem.link_text}
                      </h3>
                      <ContentMoreRow
                        movieFocused={movieFocusSet}
                        row={movieItem.link_key}
                        movies={movieItem.movies.data}
                        focusKeey={`MOVIE_LIST_${index}`}
                        index={index}
                      />
                    </div>
                  ))}
              </>
            ) : (
              <div className="result">
                <div className="search-title u700">
                  {
                    data?.data.filter((item) => item.output_type === "movie")[0]
                      .link_text
                  }
                </div>
                <div className="more-movies">
                  {movieList.map((movieItem, index) => (
                    <div ref={lastMovieElement}>
                      <MovieMore
                        movie={movieItem}
                        // movieFocus={movieFocused}
                        // onFocus={() => onAssetFocus(i, movie)}
                        // onEnter={() => handleInterPress(movie)}
                        focusKeey={`MOVIEMore_${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
  }
};

export default MoreMovies;
