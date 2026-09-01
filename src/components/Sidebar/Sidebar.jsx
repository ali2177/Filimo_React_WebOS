import React from "react";
import "./Sidebar.css";
import MenuItems from "./MenuItems";

// Thin shell around the menu: supplies the padded panel column, while MenuItems
// owns every row (head slot, list, pinned settings) because they all come from
// the same API payload and have to share one FocusContext.
const Sidebar = React.memo(({ isLogin }) => (
  <div className="nav-panel">
    <MenuItems isLogin={isLogin} />
  </div>
));

export default Sidebar;
