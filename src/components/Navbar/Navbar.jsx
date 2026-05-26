import React, { useState, useEffect } from "react";
import {
  useFocusable,
  FocusContext,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Sidebar } from "../index";
import "./Navbar.css";

function Navbar({ isLogin, hidden }) {
  const location = useLocation("");
  const { ref, focusKey, hasFocusedChild, focusSelf } = useFocusable({
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "right", "left"],
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <nav
        style={{ display: hidden ? "none" : undefined }}
        ref={ref}
        className={hasFocusedChild ? "drawer" : "drawer-focus"}
      >
        <Sidebar isLogin={isLogin} focusd={hasFocusedChild} />
      </nav>
    </FocusContext.Provider>
  );
}

export default Navbar;
