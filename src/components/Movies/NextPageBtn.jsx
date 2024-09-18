import React, { useEffect, useRef } from "react";
import {
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

const NextPageBtn = ({ movies, jwt, onEnterPress }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      handleScrolling();
    },
    onEnterPress,
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });

  const myRef = useRef();

  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      block: "end",
    });
  };

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
      className={focused ? "btn-back u700 btn-back-focus" : "btn-back u700"}
    >
      <p ref={myRef} className="u700">
        next page
      </p>
    </div>
  );
};

export default NextPageBtn;
