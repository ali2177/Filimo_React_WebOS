import React from "react";
import "./PlayerSheet.css";

const PlayerSheet = ({ title, onClose, children }) => {
  return (
    <div className="player-sheet-overlay">
      <div className="player-sheet">
        {title && <h3 className="player-sheet-title">{title}</h3>}
        <div className="player-sheet-body">{children}</div>
      </div>
    </div>
  );
};

export default PlayerSheet;
