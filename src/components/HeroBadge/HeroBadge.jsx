import React from "react";
import cornometr from "../../assets/genres/cornometr.svg";
import like from "../../assets/genres/like.svg";
import imdb from "../../assets/images/imdb-yellow.svg";
import dot from "../../assets/genres/dot.svg";

const HeroBadge = ({ movie }) => {
  console.log(movie?.categories.length);
  return (
    <div className="badge hero-badge">
      <span>{movie?.age_range}</span>
      {/* {movie?.age_range.slice(0, 2) !== "0" &&
        movie?.age_range !== "all" &&
        movie?.age_range !== "6-12" && (
          <div>
            <span>{"+" + movie?.age_range.slice(0, 2) + " سال"}</span>
          </div>
        )}
      {movie?.age_range === "all" && (
        <div>
          <span>همه</span>
        </div>
      )}
      {movie?.age_range === "6-12" && (
        <div>
          <span>6-12 سال</span>
        </div>
      )} */}
      <div style={{ marginRight: "20px" }}>
        <span className="u500">{movie?.duration.text}</span>
      </div>

      {movie?.avg_rate_label && (
        <>
          <div style={{ marginRight: "20px" }}>
            <span className="badge-rate">
              <img src={like} />
              <span className="u500">{movie?.avg_rate_label}</span>
            </span>
          </div>
        </>
      )}

      {movie?.imdb_rate !== "0" && (
        <div style={{ marginRight: "20px" }}>
          <span className="badge-imdb">
            <img src={imdb} />
            <span className="u500">{movie?.imdb_rate}</span>
          </span>
        </div>
      )}

      <div style={{ marginRight: "20px" }}>
        <span>محصول</span>
        {movie?.countries.map((cont) => (
          <span>{cont.title}</span>
        ))}
      </div>
      <div style={{ marginRight: "20px" }}>
        <span>{movie?.pro_year}</span>
      </div>

      {movie?.subtitle.enable ? (
        <>
          <div style={{ marginRight: "20px" }}>
            <span>{movie?.subtitle?.text}</span>
            <img className="dot" src={dot} />
          </div>
        </>
      ) : (
        <>
          <div style={{ marginRight: "20px" }}>
            <span>زیرنویس ندارد</span>
          </div>
        </>
      )}
      {movie?.dubbed.enable ? (
        <>
          <div style={{ marginRight: "20px" }}>
            <span>{movie?.dubbed?.text}</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginRight: "20px" }}>
            <span>دوبله ندارد</span>
          </div>
        </>
      )}

      {movie?.categories.map((cat, index) => (
        <div style={{ marginRight: "20px" }}>
          <p className="u500">{cat.title}</p>
          {index < movie?.categories.length - 1 ? "," : null}
        </div>
      ))}
    </div>
  );
};

export default HeroBadge;
