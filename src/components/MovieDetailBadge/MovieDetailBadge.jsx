import React from "react";
import dot from "../../assets/genres/dot.svg";

const MovieDetailBadge = ({ movie }) => {
  return (
    <div className="badge movie-detail u500">
      {movie?.age_range.slice(0, 2) !== "0" &&
        movie?.age_range !== "all" &&
        movie?.age_range !== "6-12" && (
          <div>
            <span>{"+" + movie?.age_range.slice(0, 2) + " سال"}</span>
            <img className="dot" src={dot} />
          </div>
        )}
      {movie?.age_range === "all" && (
        <div>
          <span>همه</span>
          <img className="dot" src={dot} />
        </div>
      )}
      {movie?.age_range === "6-12" && (
        <div>
          <span>6-12 سال</span>
          <img className="dot" src={dot} />
        </div>
      )}

      {movie?.subtitle.enable ? (
        <>
          <div>
            <span>{movie?.subtitle?.text}</span>
            <img className="dot" src={dot} />
          </div>
        </>
      ) : (
        <>
          <div>
            <span>زیرنویس ندارد</span>
            <img className="dot" src={dot} />
          </div>
        </>
      )}

      <div>
        {movie?.countries.map((cont) => (
          <span>{cont.title}</span>
        ))}
      </div>
      <img className="dot" src={dot} />
      <div>
        <span>{movie?.pro_year}</span>
      </div>
    </div>
  );
};

export default MovieDetailBadge;
