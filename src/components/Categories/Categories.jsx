import React, { useEffect } from "react";
import { useGetCategoriesQuery } from "../../services/TMDB";
import { useNavigate, useLocation } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import Category from "./category";
import { useAuth } from "../AuthProvider";
import { useOnlineStatus } from "../App";

const Categories = () => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });
  const { jwt, setJwt } = useAuth();
  const { isOnline } = useOnlineStatus();
  const { data, error, isFetching } = useGetCategoriesQuery({ jwt });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("lastdataloaded");
    localStorage.removeItem("lastdataloadedIran");
    localStorage.removeItem("lastdataloadedMovies");
    localStorage.removeItem("lastdataloadedSeries");
    localStorage.removeItem("lastdataloadedKids");
    localStorage.removeItem("lastFocus");
    localStorage.removeItem("lastFocusMoreItem");
    localStorage.removeItem("lastMovieFocus");
    localStorage.removeItem("last");
    localStorage.removeItem("lastFocusRow");
    localStorage.removeItem("lastFocusRowMoviesBeforeReload");
    localStorage.removeItem("lastFocusRowKidsBeforeReload");
    localStorage.removeItem("lastFocusRowIranBeforeReload");
    localStorage.removeItem("lastdataloadedKids");
    localStorage.removeItem("lastFocusRowBeforeReload");
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFetching) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isFetching]);
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      localStorage.removeItem("lastCatFocus");
      if (location.pathname !== "/player") navigate(-1);
    }
  };
  const handleCatInterPress = (tag_id) => {
    navigate(`/morecategory/${tag_id}`);
  };

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="cat-section"
        style={{ height: "100vh", overflowY: "auto", width: "100%" }}
      >
        <h3 className="cat-section-header u700">مجموعه ها</h3>

        <div ref={ref} className="cats" style={{ marginBottom: "4rem" }}>
          {data.data.map((catItem, index) => (
            <Category
              image={catItem.attributes.cover}
              title={catItem.attributes.title}
              focusKeey={`CAT_LIST_${index}`}
              tag_id={catItem.attributes.tag_id}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default Categories;
