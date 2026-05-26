import React, { useRef } from "react";
import { Keyboard, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Focusable } from "react-js-spatial-navigation";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ContentCrewRow from "../ContentCrewRow";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Crews = ({ crewRow }) => {
  const myRef = useRef(null);
  const navigate = useNavigate();
  // console.log(crewRow);
  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      block: "center",
    });
  };
  const movieSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };
  return (
    <div
      ref={myRef}
      className="recommendation"
      style={{ marginRight: "1.3rem" }}
      onFocus={handleScrolling}
    >
      <h3 className="u700" style={{ marginTop: "5.2rem" }}>
        عوامل
      </h3>

      <ContentCrewRow
        onFocus={handleScrolling}
        movies={crewRow}
        movieFocused={movieSet}
        type="crew"
      />
    </div>
  );
};

export default Crews;
