import React, { useState, useEffect, useRef } from "react";
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

  const [expanded, setExpanded] = useState(false);
  const expandTimer = useRef(null);

  useEffect(() => {
    if (hasFocusedChild) {
      expandTimer.current = setTimeout(() => setExpanded(true), 150);
    } else {
      clearTimeout(expandTimer.current);
      setExpanded(false);
    }
    return () => clearTimeout(expandTimer.current);
  }, [hasFocusedChild]);

  return (
    <FocusContext.Provider value={focusKey}>
      <nav
        style={{ display: hidden ? "none" : undefined }}
        ref={ref}
        className={expanded ? "drawer" : "drawer-focus"}
      >
        <Sidebar isLogin={isLogin} focusd={expanded} />
      </nav>
    </FocusContext.Provider>
  );
}

export default Navbar;
