import React from "react";
import cornometr from "../../assets/genres/cornometr.svg";
import like from "../../assets/genres/like.svg";
import imdb from "../../assets/images/imdb-yellow.svg";
import dot from "../../assets/genres/dot.svg";

const HeroBadge = ({ movie }) => {
  return (
    <div className="badge hero-badge">
      <div>
        <img src={cornometr} />
        <span className="u500">{movie?.duration.text}</span>
      </div>
      <img className="dot" src={dot} />
      {movie?.avg_rate_label && (
        <>
          <div>
            <span className="badge-rate">
              <img src={like} />
              <span className="u500">{movie?.avg_rate_label}</span>
            </span>
          </div>
          <img className="dot" src={dot} />
        </>
      )}

      {movie?.imdb_rate !== "0" && (
        <div>
          <span className="badge-imdb">
            <img src={imdb} />
            <span className="u500">{movie?.imdb_rate}</span>
          </span>
          <img className="dot" src={dot} />
        </div>
      )}

      {movie?.categories.map((cat) => (
        <span className="badge-category">
          <p className="u500">{cat.title}</p>
        </span>
      ))}
    </div>
  );
};

export default HeroBadge;
