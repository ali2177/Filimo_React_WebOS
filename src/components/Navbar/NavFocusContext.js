import { createContext, useContext } from "react";

// Menu rows report their own focus up to the navbar so it knows when to expand.
//
// Deliberately separate from norigin's FocusContext, which carries the parent
// focus key and must not be overloaded.
//
// Why this exists at all: the navbar can't rely on useFocusable's
// `hasFocusedChild` on its own. That signal is produced by
// SpatialNavigation.updateParentsHasFocusedChild(), which walks `parentFocusKey`
// from the focused row up through MenuItems to the <nav>. The walk stops at the
// first link it can't resolve, and when it stops early the nav is simply never
// told — the row highlights but the panel stays collapsed. A row's own `focused`
// flag is pushed straight to it and is always right, so it's the reliable source.
const NavFocusContext = createContext(() => {});

export const NavFocusProvider = NavFocusContext.Provider;

// () => void when there's no provider (e.g. a menu row rendered in a test).
export const useReportNavFocus = () => useContext(NavFocusContext);

export default NavFocusContext;
