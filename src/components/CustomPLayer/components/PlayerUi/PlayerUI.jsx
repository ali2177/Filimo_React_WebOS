import React, { useEffect } from "react";
import { FocusContext, useFocusable, setFocus } from "@noriginmedia/norigin-spatial-navigation";

import ControlRow        from "./ControlRow/ControlRow";
import SeekBar           from "./SeekBar/SeekBar";
import InfoRow           from "./InfoRow/InfoRow";
import SkipIntroUiButton from "./SkipIntroUiButton/SkipIntroUiButton";
import { usePlayerContext } from "../../context/PlayerContext";
import "./PlayerUi.css";

const PlayerUI = () => {
  const { showSkipIntro, seekbarActive } = usePlayerContext();

  const { ref, focusKey } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  useEffect(() => { setFocus("Play"); }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="playerUi-wrapper u500">
        <div
          className="playerUi-rows"
          style={{
            opacity: seekbarActive ? 0 : 1,
            pointerEvents: seekbarActive ? "none" : "auto",
            transition: "opacity 0.2s ease",
          }}
        >
          <InfoRow />
          <ControlRow />
          {showSkipIntro && <SkipIntroUiButton />}
        </div>
        <SeekBar />
      </div>
    </FocusContext.Provider>
  );
};

export default PlayerUI;
