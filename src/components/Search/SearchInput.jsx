import React from "react";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import keyboarsvg from "../../assets/images/keyboard-alt-1-svgrepo-com.svg";

import SearchAction from "./SearchAction";
import KeyBoardBtn from "./KeyBoardBtn";

const SearchInput = ({
  onFocus,
  onInputFocus,
  searchQuery,
  onEnter,
  onKeyboradEnter,
}) => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    onFocus,
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up"],
  });
  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="search-wrapper">
        <div className="search-input-focus">
          <input
            onFocus={() => {
              onInputFocus();
              setFocus("search-btn");
            }}
            className="search-input"
            value={searchQuery}
            placeholder="کلمه مورد نظر  خود وارد کنید."
          />
        </div>
        <SearchAction searchQuery={searchQuery} onEnterPress={onEnter} />
        <KeyBoardBtn onEnterPress={onKeyboradEnter} />
      </div>
    </FocusContext.Provider>
  );
};

export default SearchInput;
