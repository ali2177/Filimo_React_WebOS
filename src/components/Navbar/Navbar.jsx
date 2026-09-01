import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";

import { Sidebar } from "../index";
import { NavFocusProvider } from "./NavFocusContext";
import "./Navbar.css";

// How long the panel stays open after focus leaves the last row. Focus moving
// between two rows blurs the old one and focuses the new one in the same commit,
// so without this the panel would flicker shut on every arrow press.
const COLLAPSE_DELAY_MS = 150;

function Navbar({ isLogin, hidden }) {
  const { ref, focusKey, hasFocusedChild } = useFocusable({
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "right", "left"],
  });

  // Which row currently reports itself focused. Mirrored into a ref so the
  // callback stays stable and can tell a stale blur from a real one: when focus
  // hops A -> B the two reports can arrive in either order, and only the row
  // that still owns the slot is allowed to clear it.
  const [focusedRow, setFocusedRow] = useState(null);
  const focusedRowRef = useRef(null);
  const collapseTimer = useRef(null);

  const reportFocus = useCallback((rowKey, isFocused) => {
    if (isFocused) {
      focusedRowRef.current = rowKey;
      setFocusedRow(rowKey);
    } else if (focusedRowRef.current === rowKey) {
      focusedRowRef.current = null;
      setFocusedRow(null);
    }
  }, []);

  const [expanded, setExpanded] = useState(false);
  const wantsExpanded = !hidden && (hasFocusedChild || focusedRow !== null);

  useEffect(() => {
    clearTimeout(collapseTimer.current);

    if (wantsExpanded) {
      setExpanded(true);
    } else if (hidden) {
      // The route hid the nav mid-expand. Drop the state now rather than on a
      // timer, so it doesn't come back expanded the next time it's shown.
      setExpanded(false);
    } else {
      collapseTimer.current = setTimeout(
        () => setExpanded(false),
        COLLAPSE_DELAY_MS
      );
    }

    return () => clearTimeout(collapseTimer.current);
  }, [wantsExpanded, hidden]);

  return (
    <FocusContext.Provider value={focusKey}>
      <NavFocusProvider value={reportFocus}>
        <nav
          style={{ display: hidden ? "none" : undefined }}
          ref={ref}
          className={expanded ? "nav-drawer nav-drawer--expanded" : "nav-drawer"}
        >
          <Sidebar isLogin={isLogin} />
        </nav>
      </NavFocusProvider>
    </FocusContext.Provider>
  );
}

export default Navbar;
