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
import { useKeyboardAwareScroll } from "@src/hooks/useKeyboardAwareScroll";

function Actors({ actorsRow, onExitUp }) {
  const { ref, focusKey, focusSelf, focused } = useFocusable();
  const myRef = useRef();
  const navigate = useNavigate();
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);

  // Scroll only within the nearest data-scroll-boundary (the detail tab panel),
  // never chaining up to .hero-scroll-content — otherwise focusing an actor card
  // scrolls the whole movie-info page.
  const handleScrolling = useKeyboardAwareScroll(ref);
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
        <h3 className="u700">بازیگران</h3>

        <ContentCrewRow
          onFocus={handleScrolling}
          movies={actorsRow}
          movieFocused={movieSet}
          // Up-arrow from the (topmost) actors row returns focus to the tab
          // strip — the page is a focus boundary, so there is nowhere else to go.
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
    </FocusContext.Provider>
  );
}

export default Actors;
