import React, { useEffect, useState, useRef } from "react";
import { useGetActorQuery } from "../../services/TMDB";
import { Focusable } from "react-js-spatial-navigation";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Keyboard, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieSearch from "../Movie/MovieSearch.jsx";
import MovieActorProfile from "../Movie/MovieActorProfile.jsx";
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
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import ContentRow from "../ContentRow";
import ContentActorProfileRow from "../ContentActorProfileRow";

const Crew = () => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left"],
  });
  const navigate = useNavigate();
  const myRef = useRef(null);
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);
  const { crew_name } = useParams();
  const { data, error, isFetching } = useGetActorQuery(
    crew_name.replace(/%20/g, "-")
  );
  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      navigate(-1);
    }
  };
  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      block: "center",
    });
  };
  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };
  useEffect(() => {
    setFocus("MORE_LIST_1");
  }, []);

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  // if (!data.included[0]?.attributes?.link_key) {
  //   return (
  //     <main
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //       className="main"
  //     >
  //       <div display="flex" justifyContent="center">
  //         <p className="u700">اطلاعاتی موجود نیست</p>
  //       </div>
  //     </main>
  //   );
  // }
  return (
    <FocusContext.Provider value={focusKey}>
      <main className="main" style={{ paddingRight: "30px", height: "100vh" }}>
        {/* <div className="crew-header">
        <div className="crew-profile">
          <img
            className="crew-pic"
            src={data.included[0]?.attributes?.profile_image}
          />
          <div>
            <span>
              <h1 className="crew-name-fr u700">
                {data.included[0]?.attributes?.name}
              </h1>
              <h1 className="crew-name-en">
                {data.included[0]?.attributes?.link_key}
              </h1>
            </span>
            <span className="crew-detail u400">
              <span>
                <p>جنسیت</p>
                <p>{data.included[0]?.attributes.gender}</p>
              </span>
              <div className="vl"></div>
              <span>
                <p>تاریخ تولد</p>
                <p>{data.included[0]?.attributes.birth_date}</p>
              </span>
              <div className="vl"></div>
              <span>
                <p>محل تولد</p>
                <p>{data.included[0]?.attributes.birth_loc}</p>
              </span>
            </span>
          </div>
        </div>
      </div> */}
        {/* <p className="crew-bio u500">{data.included[0].attributes?.bio}</p> */}
        {/* <h3 className="u500" style={{ marginTop: "108px" }}>
        {data.data[0]?.attributes?.link_text}
      </h3>
      <div ref={myRef}>
        <ContentActorProfileRow
          onFocus={handleScrolling}
          movies={data.included}
          movieFocused={movieSet}
          type="crew"
        />
      </div> */}
        <h3 className="u700" style={{ marginTop: "58px" }}>
          {data.data[0]?.attributes?.link_text}
        </h3>
        <div className="more-movies">
          {data.included.map((movieItem, index) => (
            <>
              {index >= 1 && (
                <MovieActorProfile
                  movie={movieItem}
                  movieFocus={movieFocusSet}
                  focusKeey={`MORE_LIST_${index}`}
                />
              )}
            </>
          ))}
        </div>
        {/* <Swiper
        slidesPerView={20}
        spaceBetween={50}
        className="swiper"
        modules={[Keyboard, Pagination, Navigation]}
        keyboard={{
          enabled: true,
        }}
      >
        {data.included
          .filter((item) => item.attributes.output_type === "movie")
          .map((movieItem) => (
            <SwiperSlide className="swiper-slide">
              <Focusable
                className={"btn-focus"}
                onClickEnter={() => {
                  navigate(`/movie/${movieItem.attributes.uid}`);
                }}
              >
                <Link className="swiper-link" to={`/movie/${movieItem.uid}`}>
                  <img
                    src={movieItem.attributes.pic.movie_img_m}
                    alt={movieItem.attributes.movie_title_en}
                    className="swiper-image"
                  />

                  <h8 className="movie-title u500">
                    {movieItem.attributes.movie_title}
                  </h8>
                </Link>
              </Focusable>
            </SwiperSlide>
          ))}
      </Swiper> */}
      </main>
    </FocusContext.Provider>
  );
};

export default Crew;
