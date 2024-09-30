import React from "react";
import cornometr from "../../assets/genres/cornometr.svg";
import like from "../../assets/genres/like.svg";
import imdb from "../../assets/genres/imdb.svg";
import dot from "../../assets/genres/dot.svg";

function Badge({ movie }) {
  return (
    <div className="badge">
      {/* <div>
            <img src={cornometr} />
            <span className='u500'>160 دقیقه</span>
        </div>
        <img src={dot} /> */}
      {movie?.avg_rate_label && (
        <>
          <div>
            <img src={like} />
            <span style={{ paddingRight: "5px" }} className="u500">
              {movie?.avg_rate_label}
            </span>
          </div>
          <img className="dot" src={dot} />
        </>
      )}
      {/* {movie?.imdb_rate && (
        <>
          <div>
            <img src={imdb} />
            <span style={{ paddingRight: "5px" }} className="u500">
              {movie?.imdb_rate}
            </span>
          </div>
          <img className="dot" src={dot} />
        </>
      )} */}

      {movie?.duration?.text && (
        <>
          <div>
            <span className="u500">{movie?.duration?.text}</span>
          </div>
          <img className="dot" src={dot} />
        </>
      )}
      {movie?.subtitle?.enable && (
        <>
          <div>
            <span className="u500">{movie?.subtitle?.text}</span>
          </div>
          <img className="dot" src={dot} />
        </>
      )}
      {movie?.countries && (
        <div>
          {movie?.countries.map((cont, index) => (
            <>
              <span key={index} style={{ marginLeft: "10px" }} className="u500">
                {cont.country}
              </span>
              <img className="dot" src={dot} />
            </>
          ))}
        </div>
      )}

      <div>
        <span className="u500">{movie?.pro_year}</span>
      </div>
    </div>
  );
}

export default Badge;
