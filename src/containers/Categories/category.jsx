import React, { useRef, useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";
import { uiStorage } from "@src/utils/uiStorage";

const Category = ({ image, title, focusKeey, tag_id }) => {
  const navigate = useNavigate();
  const myRef = useRef(null);
  const handleAction = () => {
    uiStorage.setItem("lastCatFocus", focusKeey);
    navigate(`/morecategory/${tag_id}`);
  };
  const { ref, focused, focusKey } = useFocusable({
    onFocus: () => {
      handleScrolling();
    },
    onEnterPress: () => {
      handleAction();
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: focusKeey,
  });
  useEffect(() => {
    const saved = uiStorage.getItem("lastCatFocus");
    if (saved) {
      setFocus(saved);
    } else {
      setFocus("CAT_LIST_0");
    }
  }, []);
  const handleScrolling = () => {
    setTimeout(() => {
      if (uiStorage.getItem("mode") === "KeyboardMode") {
        myRef?.current?.scrollIntoView({
          block: "center",
        });
      }
    }, 10);
  };
  return (
    <div
      onClick={handleAction}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      ref={ref}
      className={focused ? "cat-focus" : "cat-not-focus"}
    >
      <div className="categorie">
        <div className="categorie-back">
          <div className="categorie-front"></div>
          <img ref={myRef} src={image} />
        </div>
        <h4 className="categorie-title u500">{title}</h4>
      </div>
    </div>
  );
};

export default Category;
