import React, { useRef } from "react";
import { Keyboard, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Focusable } from "react-js-spatial-navigation";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ContentCrewRow from "../ContentCrewRow";
import { useKeyboardAwareScroll } from "@src/hooks/useKeyboardAwareScroll";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Crews = ({ crewRow, onExitUp }) => {
  const myRef = useRef(null);
  const navigate = useNavigate();
  // console.log(crewRow);
  // Scroll only within the nearest data-scroll-boundary (the detail tab panel),
  // never chaining up to .hero-scroll-content — otherwise focusing a crew card
  // scrolls the whole movie-info page.
  const handleScrolling = useKeyboardAwareScroll(myRef);
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
      <h3 className="u700">عوامل</h3>

      <ContentCrewRow
        onFocus={handleScrolling}
        movies={crewRow}
        movieFocused={movieSet}
        type="crew"
        // Only used when the crew row is the topmost row (no actors row above);
        // up-arrow then returns focus to the tab strip.
        onItemArrowPress={
          onExitUp
            ? (direction) => {
                if (direction === "up") {
                  onExitUp();
                  return false;
                }
                return true;
              }
            : undefined
        }
      />
    </div>
  );
};

export default Crews;
