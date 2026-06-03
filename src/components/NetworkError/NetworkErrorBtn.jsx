import React, { useEffect, useRef } from "react";
import {
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, useLocation } from "react-router-dom";

const NetworkErrorBtn = ({ movies, jwt, onEnterPress }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    // onArrowPress: (e) => {
    //   // console.log(focusKey);
    //   if (e === "right") {
    //     if (location.pathname.slice(0, 8) === "/movies/") {
    //       if (localStorage.getItem("lastFocusMenuItem")) {
    //         setFocus(localStorage.getItem("lastFocusMenuItem"));
    //       } else {
    //         setFocus("menuItem__0");
    //       }
    //     }
    //   }
    // },
    onEnterPress: () => {
      navigate("/");
    },
    focusable: true,
    focusKey: "netError-btn",
  });

  const myRef = useRef();

  //   const handleScrolling = () => {
  //     myRef.current.scrollIntoView({
  //       block: "center",
  //     });
  //   };

  // const lastMovieElement = useCallback(
  //   (node) => {
  //     if (isFetching) return;
  //     if (observer.current) observer.current.disconnect();

  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting) {
  //         var myHeaders = new Headers();
  //         if (jwt) {
  //           myHeaders.append("Authorization", `Bearer ${jwt}`);
  //           var requestOptions = {
  //             method: "GET",
  //             headers: myHeaders,
  //             redirect: "follow",
  //           };
  //         } else {
  //           var requestOptions = {
  //             method: "GET",
  //             redirect: "follow",
  //           };
  //         }

  //         if (movies?.links?.forward) {
  //           fetch(`${movies?.links?.forward}`, requestOptions)
  //             .then((response) => response.json())
  //             .then((result) => {
  //               localStorage.setItem(
  //                 "lastFocusRowBeforeReload",
  //                 localStorage.getItem("lastFocusRow")
  //               );
  //               setMovies((prevmovies) => ({
  //                 ...prevmovies,
  //                 links: result?.links,
  //                 data: [...prevmovies.data, ...result.data],
  //               }));
  //             })
  //             .catch((error) => console.log("error", error));
  //         }
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [isFetching, movies]
  // );

  return (
    <div
      ref={ref}
      className={
        focused ? "btn-reload btn-reload-focus u500" : "btn-reload u500"
      }
      onClick={() => {
        navigate("/");
      }}
    >
      بازگشت به خانه
    </div>
  );
};

export default NetworkErrorBtn;
