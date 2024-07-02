import React, { useState, useEffect } from "react";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Sidebar } from "../index";
import "./Navbar.css";

function Navbar({ isLogin }) {
  const location = useLocation("");
  const { ref, focusKey, hasFocusedChild, focusSelf } = useFocusable({
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "right"],
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <nav ref={ref} className={hasFocusedChild ? "drawer" : "drawer-focus"}>
        <Sidebar isLogin={isLogin} focusd={hasFocusedChild} />
      </nav>
    </FocusContext.Provider>
  );
}

export default Navbar;
