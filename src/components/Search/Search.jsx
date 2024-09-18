import React, { useState, useRef, useEffect, useMemo } from "react";

import { useNavigate } from "react-router-dom";

import MovieSearch from "../Movie/MovieSearch.jsx";

import Keyboard from "../Keyboard/Keyboard.jsx";
import SearchInput from "./SearchInput.jsx";

function Search() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(true);
  const jwt = localStorage.getItem("jwt");

  const [curretFocusedMovie, setCurretFocusedMovie] = useState("");

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    setData(JSON.parse(localStorage.getItem("searchResult")));
    if (localStorage.getItem("searchQuery"))
      setSearchQuery(localStorage.getItem("searchQuery"));
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  useEffect(() => {
    setData(JSON.parse(localStorage.getItem("searchResult")));
  }, [JSON.parse(localStorage.getItem("searchResult"))]);

  const movieFocusSet = (movieUid) => {
    setCurretFocusedMovie(movieUid);
  };
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      localStorage.removeItem("searchQuery");
      localStorage.removeItem("searchResult");
      navigate(-1);
    }
  };

  const getData = async (querry, jwtt) => {
    try {
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/movie/movie/list/tagid/1000300/text/${querry}?json_type=simple`
      );
      const blocks = await res?.json();
      localStorage.setItem("searchResult", JSON.stringify(blocks));
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

  const handleKeyDown = () => {
    getData(searchQuery, jwt);
  };

  return (
    <div
      className="search-content"
      style={{
        overflowX: "auto",
        display: "flex",
        flexDirection: "column",
        paddingRight: "30px",
        paddingBottom: "50px",
      }}
    >
      <SearchInput onEnter={handleKeyDown} searchQuery={searchQuery} />

      {isShowKeyboard && <Keyboard keybordValue={handleKeybordBtn} />}

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
