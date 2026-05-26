import React, { useState, useRef, useEffect } from "react";
import { Keyboard, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Focusable } from "react-js-spatial-navigation";
import { Link, useNavigate } from "react-router-dom";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ContentRow from "../ContentRow";
import ContentCrewRow from "../ContentCrewRow";

function Actors({ actorsRow }) {
  const { ref, focusKey, focusSelf, focused } = useFocusable();
  const myRef = useRef();
  const navigate = useNavigate();
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);

  const handleScrolling = () => {
    ref.current.scrollIntoView({
      block: "start",
    });
  };
  const movieSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className="recommendation"
        style={{
          marginRight: "1.7rem",
          marginBottom: "0px",
        }}
        onFocus={handleScrolling}
      >
        <h3 className="u700" style={{ marginTop: "2.5rem" }}>
          بازیگران
        </h3>

        <ContentCrewRow
          onFocus={handleScrolling}
          movies={actorsRow}
          movieFocused={movieSet}
        />
      </div>
    </FocusContext.Provider>
  );
}

export default Actors;
