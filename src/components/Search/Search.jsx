import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";

import { useNavigate, useLocation } from "react-router-dom";

import MovieSearch from "../Movie/MovieSearch.jsx";

import Keyboard from "../Keyboard/Keyboard.jsx";
import SearchInput from "./SearchInput.jsx";
import KeyboardWithCaretFake from "../Keyboard/KeyBoardWithCaret.jsx";

function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const jwt = localStorage.getItem("jwt");

  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");

  useEffect(() => {
    localStorage.removeItem("lastFocus");
    localStorage.removeItem("lastFocusRow");
    localStorage.removeItem("lastMovieFocus");
    localStorage.removeItem("lastRouteNotplayer");
    localStorage.removeItem("lastSeasonFocus_parent_new");
    localStorage.removeItem("lastSeasonFocus_season_part");
    window.addEventListener("keydown", keyHandler);

    setData(JSON.parse(localStorage.getItem("searchResult")));
    if (localStorage.getItem("searchQuery"))
      setSearchQuery(localStorage.getItem("searchQuery"));
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  // useEffect(() => {
  //   setData(JSON.parse(localStorage.getItem("searchResult")));
  // }, [JSON.parse(localStorage.getItem("searchResult"))]);

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      localStorage.removeItem("searchQuery");
      localStorage.removeItem("searchResult");
      if (location.pathname !== "/player") navigate(-1);
    }
  };

  const getData = async (querry, jwtt) => {
    try {
      const userAgent = {
        os: "WebOs",
        an: "Filimo",
        vn: "1.00",
      };
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/movie/movie/list/tagid/1000300/text/${querry}?devicetype=react_tizen&json_type=simple`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            UserAgent: JSON.stringify(userAgent),
          },
        }
      );
      const blocks = await res?.json();
      localStorage.setItem(
        "searchResult",
        JSON.stringify(
          blocks.data.filter((item) => item.output_type === "movie")
        )
      );
      localStorage.setItem("searchQuery", querry);
      navigate("/searchResult");
      setData(blocks);
    } catch (e) {
      console.log(e);
    }
  };

  const handleKeybordBtn = (item) => {
    if (item === "delete") {
      setSearchQuery((prev) => (prev = prev.substring(0, prev.length - 1)));
    } else {
      setSearchQuery((prev) => prev + item);
    }
  };

  const handleKeyDown = (value) => {
    console.log(value);
    if (!value) return;
    getData(value, jwt);
  };

  return (
    <div
      className="search-content"
      style={{
        overflowX: "auto",
        display: "flex",
        flexDirection: "column",
        paddingTop: "2rem",
        paddingRight: "1.5rem",
        paddingBottom: "4rem",
      }}
    >
      {/* <SearchInput
        onKeyboradEnter={() => {
          setIsShowKeyboard(!isShowKeyboard);
        }}
        onEnter={handleKeyDown}
        searchQuery={searchQuery}
        onInputFocus={() => {
          setIsShowKeyboard(false);
        }}
      /> */}

      <KeyboardWithCaretFake onEnter={handleKeyDown} />

      {/* {isShowKeyboard && <Keyboard keybordValue={handleKeybordBtn} />} */}

      {/* {data ? (
        <div className="result">
          <h1>{data.data[0].link_text}</h1>
          <div className="more-movies">
            {data.data[0].movies?.data.map((movieItem) => (
              <MovieSearch movie={movieItem} movieFocus={movieFocusSet} />
            ))}
          </div>
        </div>
      ) : null} */}
    </div>
  );
}

export default Search;
