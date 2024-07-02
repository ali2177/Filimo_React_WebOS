import React, { useRef, useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

const Category = ({ image, title, focusKeey, tag_id }) => {
  const navigate = useNavigate();
  const myRef = useRef(null);
  const { ref, focused } = useFocusable({
    onFocus: () => {
      handleScrolling();
    },
    onEnterPress: () => {
      localStorage.setItem("lastCatFocus", focusKeey);
      navigate(`/morecategory/${tag_id}`);
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focusKeey,
  });
  useEffect(() => {
    if (localStorage.getItem("lastCatFocus")) {
      setFocus(localStorage.getItem("lastCatFocus"));
    } else {
      setFocus("CAT_LIST_0");
    }
  }, []);
  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };
  return (
    <div ref={ref} className={focused ? "cat-focus" : "cat-not-focus"}>
      <div className="categorie">
        <div className="categorie-back">
          <div className="categorie-front"></div>
          <img ref={myRef} src={image} />
        </div>
        <h4 className="u500">{title}</h4>
      </div>
    </div>
  );
};

export default Category;
