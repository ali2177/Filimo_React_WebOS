import React from "react";
import { usePlayerContext } from "../../../context/PlayerContext";
import "./InfoRow.css";

const InfoRow = () => {
  const { movieTitle, movieFullTitle, movieSubtitle, isSeries } = usePlayerContext();
  const title = isSeries ? movieTitle : movieFullTitle;
  const subtitle = isSeries ? movieSubtitle : null;

  return (
    <div className="Info-row">
      <div className="Info-row-titles">
        <span className="main-title u700">{title}</span>
        {subtitle && <span className="main-Subtitle u500">{subtitle}</span>}
      </div>
    </div>
  );
};

export default InfoRow;
