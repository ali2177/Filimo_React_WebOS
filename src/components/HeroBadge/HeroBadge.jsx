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
      {/* {movie?.age_range.slice(0, 2) !== "0" &&
        movie?.age_range !== "all" &&
        movie?.age_range.length === 5 && (
          <div>
            <span className="u500">
              {convertToFarsi(movie?.age_range.slice(0, 2)) + "+"}
            </span>
          </div>
        )} */}
      {/* {movie?.age_range === "all" && null} */}
      {/* {movie?.age_range.slice(0, 1) === "0" && null} */}
      {/* {(movie?.age_range.length === 3 || movie?.age_range.length === 4) &&
        movie?.age_range !== "all" &&
        movie?.age_range.slice(0, 1) !== "0" && (
          <div>
            <span className="u500">
              {convertToFarsi(movie?.age_range.slice(0, 1)) + "+"}
            </span>
          </div>
        )} */}
      <div>
        <span className="u500">{convertToFarsi(movie?.duration.text)}</span>
      </div>

      {movie?.avg_rate_label && (
        <>
          <div style={{ marginRight: "1.2rem" }}>
            <span className="badge-rate">
              <img src={like} />
              <span className="u500">{movie?.avg_rate_label}</span>
            </span>
          </div>
        </>
      )}

      {/* <div style={{ marginRight: "1.2rem" }}>
        <span className="u500">محصول</span>
        {movie?.countries.map((cont, index) => (
          <span style={{ marginRight: "5px" }} className="u500">
            {cont.title}
          </span>
        ))}
      </div> */}
      {/* <div style={{ marginRight: "1.2rem" }}>
        <span className="u500">{convertToFarsi(movie?.pro_year)}</span>
      </div> */}

      {movie?.subtitle.enable ? (
        <>
          <div style={{ marginRight: "2.1rem" }}>
            <span className="u500">زیرنویس</span>
          </div>
        </>
      ) : null}
      {movie?.dubbed.enable ? (
        <>
          <div style={{ marginRight: "2.1rem" }}>
            <span className="u500">دوبله</span>
          </div>
        </>
      ) : null}

      <div style={{ marginRight: "2rem" }}>
        {movie?.categories.map((cat, index) => (
          <>
            <div style={{ marginRight: "0.4rem" }}>
              <span className="u500">{cat.title}</span>
            </div>
            {index < movie?.categories.length - 1 && <span>,</span>}
          </>
        ))}
      </div>

      {movie?.imdb_rate !== "0" && (
        <div style={{ marginRight: "2.1rem" }}>
          <span className="badge-imdb">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="15"
              viewBox="0 0 38 15"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0239 0.0437172C10.18 0.91807 10.3361 1.92358 10.4923 3.08938L11.0544 6.73252L11.9599 0H17.0187V14.5726H13.6306V4.66322L12.2722 14.6017H9.94581L8.50937 4.91095V14.6163H5.10564V0.0437172H10.0239ZM0 0.0436592H3.40373V14.6016H0V0.0436592ZM37.4723 5.5958C37.4207 5.31077 37.2976 5.04115 37.1132 4.80888C36.8936 4.52475 36.5897 4.3069 36.2389 4.18226C35.8092 4.01454 35.346 3.93502 34.8805 3.9491C34.3994 3.94672 33.9223 4.03083 33.4753 4.19684C33.074 4.37897 32.7178 4.63703 32.4292 4.95461V0.0436592H28.963V14.6162H32.3667V13.4067C32.6485 13.742 33.0055 14.0156 33.4128 14.2082C33.8576 14.3828 34.3355 14.4721 34.818 14.4705C35.3739 14.4755 35.9183 14.3231 36.3794 14.0333C36.7924 13.7791 37.0963 13.3973 37.2381 12.9549C37.3968 12.3641 37.4755 11.757 37.4723 11.1479V7.2425C37.5093 6.69414 37.5093 6.14416 37.4723 5.5958ZM34.4902 11.6434C34.5066 11.7567 34.4969 11.872 34.4617 11.9816C34.4265 12.0911 34.3666 12.1923 34.286 12.2785C34.2054 12.3646 34.106 12.4336 33.9944 12.481C33.8829 12.5283 33.7618 12.5527 33.6392 12.5527C33.5167 12.5527 33.3956 12.5283 33.284 12.481C33.1725 12.4336 33.073 12.3646 32.9924 12.2785C32.9118 12.1923 32.8519 12.0911 32.8167 11.9816C32.7815 11.872 32.7718 11.7567 32.7883 11.6434V6.68874C32.8162 6.49662 32.9179 6.32046 33.0743 6.19291C33.2308 6.06536 33.4315 5.99508 33.6392 5.99508C33.847 5.99508 34.0477 6.06536 34.2041 6.19291C34.3606 6.32046 34.4622 6.49662 34.4902 6.68874V11.6434ZM24.9815 0.291451C25.5833 0.397427 26.1316 0.68398 26.5428 1.10751C26.845 1.47343 27.0436 1.9044 27.1205 2.36075C27.2251 3.26564 27.2669 4.1759 27.2455 5.08582V10.1279C27.2827 10.9867 27.2199 11.8466 27.0581 12.6927C26.9637 13.0866 26.7399 13.4433 26.4179 13.7128C26.1132 14.0488 25.7281 14.3133 25.2938 14.4851C24.6284 14.5885 23.954 14.6325 23.2796 14.6163H18.7361V0.0437171H21.4841C22.6563 -0.00268567 23.8302 0.0804698 24.9815 0.291451ZM23.6426 11.6368C23.8003 11.4869 23.8886 11.2852 23.8886 11.0751V3.42455C23.8886 3.21448 23.8003 3.0128 23.6426 2.8629C23.4849 2.713 23.2705 2.62688 23.0454 2.62306H22.1867V11.8766H23.0454C23.2705 11.8728 23.4849 11.7867 23.6426 11.6368Z"
                fill="#E8E8E8"
              />
            </svg>
            <span className="u500">{movie?.imdb_rate}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default HeroBadge;
