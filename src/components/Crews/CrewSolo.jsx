import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, Link } from "react-router-dom";
import { uiStorage } from "@src/utils/uiStorage";
import { centerHorizontally } from "@src/utils/scrollHelpers";

const CrewSolo = ({ actor, onFocus, onEnterPress, name, focusKeey }) => {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    onFocus: (...args) => {
      // Keep the focused crew member centered in its row, matching the home rows.
      if (uiStorage.getItem("mode") === "KeyboardMode") {
        setTimeout(() => centerHorizontally(ref.current), 10);
      }
      onFocus?.(...args);
    },
    onEnterPress: () => {
      uiStorage.setItem("lastFocusCrew", focusKeey);
      uiStorage.removeItem("lastFocusActor");
      navigate(`/actor/${name}`);
    },
    focusKey: focusKeey,
  });
  return (
    <Link className="swiper-link" to={`/actor/${name}`}>
      <img
        ref={ref}
        style={{
          border: focused ? "0.22rem solid red" : "none",
        }}
        src={actor.profile[0].profile_image}
        alt={actor.profile[0].name_en}
        className="actor-image"
      />

      <h6 className="movie-title u700">
        {" "}
        {actor.profile[0].name.length > 20
          ? actor.profile[0].name.slice(0, 15)
          : actor.profile[0].name}
      </h6>
      <h6 className="movie-title u700">{actor.post_info.title}</h6>
    </Link>
  );
};

export default CrewSolo;
