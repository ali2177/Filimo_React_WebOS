import React from "react";
import cornometr from "../../assets/genres/cornometr.svg";
import like from "../../assets/genres/like.svg";
import imdb from "../../assets/images/imdb-yellow.svg";
import dot from "../../assets/genres/dot.svg";

const HeroBadge = ({ movie }) => {
  const convertToFarsi = (number) => {
    const farsiNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(number)
      .split("")
      .map((num) => farsiNumbers[num] || num)
      .join("");
  };
  return (
    <div className="badge hero-badge">
      {/* <span>{movie?.age_range}</span> */}
      {movie?.age_range.slice(0, 2) !== "0" &&
        movie?.age_range !== "all" &&
        movie?.age_range.length === 5 && (
          <div>
            <span className="u500">
              {convertToFarsi(movie?.age_range.slice(0, 2)) + "+"}
            </span>
          </div>
        )}
      {movie?.age_range === "all" && null}
      {(movie?.age_range.length === 3 || movie?.age_range.length === 4) &&
        movie?.age_range !== "all" && (
          <div>
            <span className="u500">
              {convertToFarsi(movie?.age_range.slice(0, 1)) + "+"}
            </span>
          </div>
        )}
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
        <span className="u500">محصول</span>
        {movie?.countries.map((cont, index) => (
          <span style={{ marginRight: "5px" }} className="u500">
            {cont.title}
          </span>
        ))}
      </div>
      <div style={{ marginRight: "20px" }}>
        <span className="u500">{convertToFarsi(movie?.pro_year)}</span>
      </div>

      {movie?.subtitle.enable ? (
        <>
          <div style={{ marginRight: "20px" }}>
            <span className="u500">{movie?.subtitle?.text}</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginRight: "20px" }}>
            <span className="u500">زیرنویس ندارد</span>
          </div>
        </>
      )}
      {movie?.dubbed.enable ? (
        <>
          <div style={{ marginRight: "20px" }}>
            <span className="u500">{movie?.dubbed?.text}</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginRight: "20px" }}>
            <span className="u500">دوبله ندارد</span>
          </div>
        </>
      )}

      {movie?.categories.map((cat, index) => (
        <div style={{ marginRight: "20px" }}>
          <span className="u500">{cat.title}</span>
        </div>
      ))}
    </div>
  );
};

export default HeroBadge;
