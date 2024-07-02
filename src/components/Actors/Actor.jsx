import React from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate, Link } from "react-router-dom";

const Actor = ({ actor, onFocus, onEnterPress, focusKeey, name }) => {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    onFocus,
    onEnterPress: () => {
      localStorage.setItem("lastFocusActor", focusKeey);
      localStorage.removeItem("lastFocusCrew");
      navigate(`/actor/${name}`);
    },
    isFocusBoundary: false,
    focusKey: focusKeey,
  });
  return (
    <Link className="swiper-link" to={`/`}>
      <img
        ref={ref}
        style={{
          border: focused ? "2px solid red" : "none",
        }}
        src={actor.profile_image}
        alt={actor.name_en}
        className="actor-image"
      />

      <h8 className="movie-title u700">{actor.name}</h8>
    </Link>
  );
};

export default Actor;
