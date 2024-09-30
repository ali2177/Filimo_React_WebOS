import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MovieList } from "../index";
import { useGetMoviesQuery } from "../../services/TMDB";
import Content from "../Content/Content";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import Snackbar from "../Snackbar/Snackbar";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import ContentRow from "../ContentRow";

function Movies({ isLogin }) {
  const { ref, focusKey, focusSelf, focused } = useFocusable({
    forceFocus: false,
    saveLastFocusedChild: false,
  });
  const myRef = useRef(null);
  const scrollRef = useRef(null);
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);
  const [movies, setMovies] = useState(null);
  const [pageLocation, setPageLocation] = useState();
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  let doubleClickFlag;
  const location = useLocation("");
  const navigate = useNavigate();
  const { tag_id, other_data } = useParams();
  const observer = useRef();
  let jwt = localStorage.getItem("jwt");
  const { data, error, isFetching } = useGetMoviesQuery({
    tag_id,
    other_data,
    jwt,
  });

  const onRowFocus = React.useCallback(
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

  useEffect(() => {
    // focusSelf();
    // localStorage.removeItem("lastFocus");
    localStorage.removeItem("lastCatFocus");
    localStorage.removeItem("lastFocusMore");
    localStorage.removeItem("lastFocusActor");
    localStorage.removeItem("lastFocusCrew");
    localStorage.removeItem("lastFocusRecomm");
    localStorage.removeItem("lastFocusCat");
    localStorage.removeItem("lastFocusMoreMovie");
    localStorage.removeItem("seasonBtn");
    localStorage.removeItem("recommBtn");
    localStorage.removeItem("lastSeasonFocus");
    localStorage.removeItem("movie_cast_time");
    localStorage.removeItem("movie_uid");
    setPageLocation(location.pathname);
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [location]);
  useEffect(() => {
    jwt = localStorage.getItem("jwt");
  }, [isLogin]);

  useEffect(() => {
    console.log(location.pathname.slice(16));
    if (location.pathname === "/") {
      if (JSON.parse(localStorage.getItem("lastdataloaded"))?.data) {
        setMovies(JSON.parse(localStorage.getItem("lastdataloaded")));
      } else {
        if (data) setMovies(data);
      }
    } else if (location.pathname.slice(16) === "/series") {
      if (JSON.parse(localStorage.getItem("lastdataloadedSeries"))?.data) {
        setMovies(JSON.parse(localStorage.getItem("lastdataloadedSeries")));
      } else {
        if (data) setMovies(data);
      }
    } else if (location.pathname.slice(16) === "/movie") {
      if (JSON.parse(localStorage.getItem("lastdataloadedMovies"))?.data) {
        setMovies(JSON.parse(localStorage.getItem("lastdataloadedMovies")));
      } else {
        if (data) setMovies(data);
      }
    } else if (location.pathname.slice(16) === "/iran") {
      if (JSON.parse(localStorage.getItem("lastdataloadedIran"))?.data) {
        setMovies(JSON.parse(localStorage.getItem("lastdataloadedIran")));
      } else {
        if (data) setMovies(data);
      }
    } else if (location.pathname.slice(16) === "001215/kids") {
      if (JSON.parse(localStorage.getItem("lastdataloadedKids"))?.data) {
        setMovies(JSON.parse(localStorage.getItem("lastdataloadedKids")));
      } else {
        if (data) setMovies(data);
      }
    }

    if (data) {
      setCurretFocusedMovie(
        data.data.filter((item) => item.output_type === "movie")[0]?.movies
          ?.data[0]
      );
    }
  }, [data]);
  useEffect(() => {
    if (location.pathname === "/") {
      if (localStorage.getItem("lastFocusRowBeforeReload"))
        setFocus(`${localStorage.getItem("lastFocusRowBeforeReload")}__0`);
    } else if (location.pathname.slice(16) === "/series") {
      if (localStorage.getItem("lastFocusRowSeriesBeforeReload"))
        setFocus(
          `${localStorage.getItem("lastFocusRowSeriesBeforeReload")}__0`
        );
    } else if (location.pathname.slice(16) === "/movie") {
      if (localStorage.getItem("lastFocusRowMoviesBeforeReload"))
        setFocus(
          `${localStorage.getItem("lastFocusRowMoviesBeforeReload")}__0`
        );
    } else if (location.pathname.slice(16) === "/iran") {
      if (localStorage.getItem("lastFocusRowIranBeforeReload"))
        setFocus(`${localStorage.getItem("lastFocusRowIranBeforeReload")}__0`);
    } else if (location.pathname.slice(16) === "001215/kids") {
      if (localStorage.getItem("lastFocusRowKidsBeforeReload"))
        setFocus(`${localStorage.getItem("lastFocusRowKidsBeforeReload")}__0`);
    } else {
      if (localStorage.getItem("lastFocus")) {
        setFocus(localStorage.getItem("lastFocus"));
      }
    }
  }, [movies]);

  useEffect(() => {
    setCurretFocusedMovie(null);
  }, [other_data]);

  const movieSet = (movieUid, focusKeey) => {
    setCurretFocusedMovie(movieUid);
    // setTimeout(() => {
    //   console.log(curretFocusedMovie);
    // }, 2000);

    // console.log(movieUid);
    // console.log(focusKeey);
    if (focusKeey) {
      if (focusKeey.slice(6, 7) === "0") {
        setShowPoster(true);
      } else {
        setShowPoster(false);
      }
    }
  };

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      if (location.pathname === "/") {
        if (doubleClickFlag) {
          localStorage.removeItem("lastdataloaded");
          localStorage.removeItem("lastFocus");
          window.tizen.application.getCurrentApplication().exit();
        }
        setShowExitModal(true);
        doubleClickFlag = 1;
        setTimeout(() => {
          setShowExitModal(false);
          doubleClickFlag = 0;
        }, 10000);
      } else {
        navigate(-1);
      }
    }
  };

  // useEffect(() => {
  //   setFocus("sn:focusable-item-12");
  // }, [focusSelf]);

  const lastMovieElement = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          var myHeaders = new Headers();
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

          if (movies?.links?.forward) {
            fetch(`${movies?.links?.forward}`, requestOptions)
              .then((response) => response.json())
              .then((result) => {
                setMovies((prevmovies) => ({
                  ...prevmovies,
                  links: result?.links,
                  data: [...prevmovies.data, ...result.data],
                }));
                if (location.pathname === "/") {
                  localStorage.setItem(
                    "lastFocusRowBeforeReload",
                    localStorage.getItem("lastFocusRow")
                  );
                  setTimeout(() => {
                    localStorage.setItem(
                      "lastdataloaded",
                      JSON.stringify({
                        ...movies,
                        links: result?.links,
                        data: [...movies.data, ...result.data],
                      })
                    );
                  }, 3000);
                }
                if (location.pathname.slice(16) === "/series") {
                  localStorage.setItem(
                    "lastFocusRowSeriesBeforeReload",
                    localStorage.getItem("lastFocusRow")
                  );
                  setTimeout(() => {
                    localStorage.setItem(
                      "lastdataloadedSeries",
                      JSON.stringify({
                        ...movies,
                        links: result?.links,
                        data: [...movies.data, ...result.data],
                      })
                    );
                  }, 3000);
                }
                if (location.pathname.slice(16) === "/movie") {
                  localStorage.setItem(
                    "lastFocusRowMoviesBeforeReload",
                    localStorage.getItem("lastFocusRow")
                  );
                  setTimeout(() => {
                    localStorage.setItem(
                      "lastdataloadedMovies",
                      JSON.stringify({
                        ...movies,
                        links: result?.links,
                        data: [...movies.data, ...result.data],
                      })
                    );
                  }, 3000);
                }
                if (location.pathname.slice(16) === "/iran") {
                  localStorage.setItem(
                    "lastFocusRowIranBeforeReload",
                    localStorage.getItem("lastFocusRow")
                  );
                  setTimeout(() => {
                    localStorage.setItem(
                      "lastdataloadedIran",
                      JSON.stringify({
                        ...movies,
                        links: result?.links,
                        data: [...movies.data, ...result.data],
                      })
                    );
                  }, 3000);
                }
                if (location.pathname.slice(16) === "001215/kids") {
                  localStorage.setItem(
                    "lastFocusRowKidsBeforeReload",
                    localStorage.getItem("lastFocusRow")
                  );
                  setTimeout(() => {
                    localStorage.setItem(
                      "lastdataloadedKids",
                      JSON.stringify({
                        ...movies,
                        links: result?.links,
                        data: [...movies.data, ...result.data],
                      })
                    );
                  }, 3000);
                }
              })
              .catch((error) => console.log("error", error));
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, movies]
  );

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  if (!data.data[0]) return <NetworkError />;

  return (
    <>
      <main className="main">
        {showExitModal && <Snackbar />}
        <>
          <div
            ref={scrollRef}
            style={{
              overflow: "hidden",
              overflowY: "scroll",
              height: "100vh",
            }}
          >
            {pageLocation === "/" && showPoster && (
              <Content
                data={data.data.filter((item) => item.output_type === "movie")}
                curretFocusedMovie={curretFocusedMovie}
                type={other_data}
                firstRow={data.data.filter(
                  (item) => item.output_type === "movie"
                )}
              />
            )}
            <div
              ref={myRef}
              style={{
                paddingTop: "30px",
                marginRight: "30px",
                marginTop: pageLocation === "/" ? "-450px" : "0",
                position: "relative",
              }}
            >
              {movies &&
                movies.data
                  .filter((item) => item.output_type === "movie")
                  .map(
                    (movieItem, index) => (
                      <>
                        <div ref={lastMovieElement}>
                          <ContentRow
                            title={movieItem.link_text}
                            movieFocused={movieSet}
                            movies={movieItem.movies.data}
                            focusKeey={`MOVIE_LIST_${index}`}
                            index={index}
                            movieLinkKey={movieItem.link_key}
                            movieTag={movieItem.tag_id}
                            onFocus={onRowFocus}
                            row={
                              movieItem.link_key
                                ? movieItem.link_key
                                : movieItem.tag_id
                            }
                            scrollRef={scrollRef}
                          />
                        </div>
                      </>
                    )
                    // movieItem.link_text != null ? (
                    //   <div
                    //     key={movieItem.id}
                    //     // ref={lastMovieElement}
                    //     style={{ marginBottom: "50px" }}
                    //   >
                    //     <h3 className="u700">{movieItem.link_text}</h3>

                    //     <MovieList
                    //       movieFocused={movieSet}
                    //       row={
                    //         movieItem.link_key
                    //           ? movieItem.link_key
                    //           : movieItem.tag_id
                    //       }
                    //       movies={movieItem.movies.data}
                    //     />
                    //   </div>
                    // ) : (
                    //   ""
                    // )
                  )}
            </div>
          </div>
        </>
      </main>
    </>
  );
}

export default Movies;
