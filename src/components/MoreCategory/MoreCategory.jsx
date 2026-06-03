import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MovieList } from "../index";
import { useGetCategoriesQuery } from "../../services/TMDB";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { Focusable } from "react-js-spatial-navigation";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";

import ContentCatRow from "../ContentCatRow";

const MoreCategory = () => {
  const myRef = useRef(null);
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up"],
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { tag_id, other_data } = useParams();
  const { data, error, isFetching } = useGetCategoriesQuery({ tag_id });
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);

  useEffect(() => {
    localStorage.removeItem("lastFocusCat");
    window.addEventListener("keydown", keyHandler);
    window.scrollTo({ top: 0 });
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    focusSelf();
  });
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      if (location.pathname !== "/player") navigate(-1);
    }
  };
  const onRowFocus = React.useCallback(
    ({ y }) => {
      myRef.current.scrollTo({
        top: y,
      });
      // console.log(ref.current.scrollTop);
      // ref.current.scrollTop += 10;
      // console.log(ref.current.scrollTop);
      // ref.current.style.scrollBehavior = "smooth";
    },
    [ref]
  );

  const movieSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  if (
    data.data.length === 0 ||
    !data.data.some((movieItem) => movieItem.movies.data.length > 0)
  )
    return <NetworkError errorText="دیتایی یافت نشد" />;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={myRef}
        style={{
          paddingRight: "2.2rem",
          paddingTop: "1rem",
          overflow: "hidden",
          overflowY: "scroll",
          height: "100vh",
          width: "100%",
          background:
            "linear-gradient(270deg, #151515 0%, rgba(17, 17, 17, 0.75) 50.79%, rgba(12, 12, 12, 0) 100%), linear-gradient(180deg, rgba(21, 21, 21, 0) 67.35%, #151515 100%)",
        }}
      >
        {data.data.map((movieItem, index) =>
          movieItem.link_text != null && movieItem.movies.data.length > 0 ? (
            <div>
              <h3
                style={{ paddingTop: "0px", margin: "0.7rem 0.7rem 0px 0px" }}
                className="u700"
              >
                {movieItem.link_text}
              </h3>

              <ContentCatRow
                movieFocused={movieSet}
                row={movieItem.tag_id}
                movies={movieItem.movies.data}
                index={index}
                focusKeey={`MOVIE_LIST_${index}`}
              />
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default MoreCategory;
