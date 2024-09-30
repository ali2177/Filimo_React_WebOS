import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import splash from "../../../src/assets/images/telika-splash-logo.svg";

const Splash = ({ jwtSub, user }) => {
  let x;
  return (
    <div className="splash">
      <img src={splash} alt="" />
    </div>
  );
};

export default Splash;
