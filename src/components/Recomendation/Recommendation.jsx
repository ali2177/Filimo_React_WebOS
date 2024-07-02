import React, { useRef, useCallback, useState } from "react";

import { Keyboard, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Focusable } from "react-js-spatial-navigation";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ContentOnlyRow from "../ContentOnlyRow";
import ContentRow from "../ContentRow";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Recommendation = ({ movieRow, rowId }) => {
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);
  const myRef = useRef();
  const scrollingRef = useRef();
  const navigate = useNavigate();
  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      block: "end",
    });
  };
  const movieSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };
  // const onAssetFocus = useCallback(() => {
  //   console.log(scrollingRef);
  //   scrollingRef.current.scrollTo({
  //     right: "10px",
  //     behavior: "smooth",
  //   });
  // }, [scrollingRef]);
  // const onMovieFocus = () =>{
  //     movieFocus(movie.uid)
  //   }

  // const movieSet = (movieUid)=>{
  //     setCurretFocusedMovie(movieUid);
  //   }

  return (
    <div
      ref={myRef}
      className="recommendation"
      style={{ marginRight: "40px", marginBottom: "10px", marginTop: "100px" }}
    >
      <h3 className="u500" style={{ marginTop: "200px" }}>
        {movieRow?.link_text}
      </h3>

      <ContentOnlyRow
        onFocus={handleScrolling}
        movies={movieRow.movies.data}
        movieFocused={movieSet}
        type="crew"
        row={rowId}
      />
    </div>
  );
};

export default Recommendation;
