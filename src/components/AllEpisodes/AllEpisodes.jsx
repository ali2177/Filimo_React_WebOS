import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MovieList } from "../index";
import { useGetAllEpisodesQuery } from "../../services/TMDB";
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
import ContentRow from "../ContentRow";
import ContentOnlyRow from "../ContentOnlyRow";
import ContentMoreRow from "../ContentMoreRow.jsx";

const AllEpisodes = () => {
  const myRef = useRef(null);
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    preferredChildFocusKey: null,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left"],
  });
  const navigate = useNavigate();
  const { ui_id } = useParams();
  const { data, error, isFetching } = useGetAllEpisodesQuery(ui_id);
  const [curretFocusedMovie, setCurretFocusedMovie] = useState(null);

  useEffect(() => {
    localStorage.removeItem("lastFocusActor");
    localStorage.removeItem("lastFocusCrew");
    window.addEventListener("keydown", keyHandler);
    window.scrollTo({ top: 0 });
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      navigate(-1);
    }
  };
  const onRowFocus = React.useCallback(
    ({ y }) => {
      myRef.current.scrollTo({
        top: y,
        behavior: "smooth",
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

  if (data.data.length === 0)
    return <NetworkError errorText="دیتایی یافت نشد" />;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={myRef}
        style={{
          marginRight: "40px",
          overflow: "hidden",
          overflowY: "scroll",
          height: "100%",
        }}
      >
        {data.data.map((movieItem, index) =>
          movieItem.link_text != null ? (
            <div>
              <h3 className="u700" style={{ marginTop: "108px" }}>
                {movieItem.link_text}
              </h3>

              <ContentMoreRow
                linkText={data.data[0].link_text}
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

export default AllEpisodes;
