import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import searchsvg from "../../assets/genres/search.svg";

const SearchAction = ({ searchQuery, onEnterPress }) => {
  const jwt = localStorage.getItem("jwt");
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {},
    onEnterPress,
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: "search-btn",
  });

  useEffect(() => {
    // setFocus("search-btn");
    // console.log(getCurrentFocusKey());
    focusSelf();
  }, []);

  const getData = async (querry, jwtt) => {
    try {
      const res = await fetch(
        `https://www.televika.com/api/fa/v1/movie/movie/list/tagid/1000300/text/${querry}?json_type=simple`
      );
      const blocks = await res?.json();
      localStorage.setItem("searchResult", JSON.stringify(blocks));
      localStorage.setItem("searchQuery", querry);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div
      ref={ref}
      className={
        focused ? "search-action search-action-focus" : "search-action"
      }
    >
      <img src={searchsvg} style={{ width: "40px" }} />
    </div>
  );
};

export default SearchAction;
