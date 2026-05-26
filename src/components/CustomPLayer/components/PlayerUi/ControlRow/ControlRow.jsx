import React from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../../context/PlayerContext";

import PLayerButton from "./components/PlayerButton";
import PlayIcon from "./icons/PlayIcon";
import PauseIcon from "./icons/PauseIcon";
import RewindIcon from "./icons/RewindIcon";
import ForwardIcon from "./icons/ForwardIcon";
import RestartIcon from "./icons/RestartIcon";
import EpisodesIcon from "./icons/EpisodesIcon";
import NextEpisodeIcon from "./icons/NextEpisodeIcon";
import AudioIcon from "./icons/AudioIcon";
import SubtitleIcon from "./icons/SubtitleIcon";
import SettingsIcon from "./icons/SettingsIcon";

const ControlRow = () => {
  const { playing, togglePlay, seek, openModal, isSeries, audioTracks, subtitles, levels, actualLevelIndex, onNextEpisode } = usePlayerContext();

  const qualityBadge = (() => {
    const h = levels[actualLevelIndex]?.height;
    if (!h) return null;
    if (h >= 2440) return "2K";
    if (h >= 1080) return "FHD";
    if (h >= 720) return "HD";
    return null;
  })();

  const { ref, focusKey } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="controls-row">
        <div className="control-row-section">
          <PLayerButton handleAction={togglePlay} focuskey="Play">
            {playing ? <PauseIcon /> : <PlayIcon />}
          </PLayerButton>
          <PLayerButton handleAction={() => seek(-15)} focuskey="Forward">
            <RewindIcon />
          </PLayerButton>
          <PLayerButton handleAction={() => seek(+15)} focuskey="Backward">
            <ForwardIcon />
          </PLayerButton>
          <PLayerButton handleAction={() => seek(0)} focuskey="Replay">
            <RestartIcon />
          </PLayerButton>
        </div>
        <div className="control-row-section">
          {isSeries && (
            <PLayerButton handleAction={() => openModal("episodes")} focuskey="SeriesEpisodes">
              <EpisodesIcon />
            </PLayerButton>
          )}
          {isSeries && (
            <PLayerButton handleAction={() => onNextEpisode?.(isSeries)} focuskey="NextEpisode">
              <NextEpisodeIcon />
            </PLayerButton>
          )}
          {audioTracks.length > 1 && (
            <PLayerButton handleAction={() => openModal("audio")} focuskey="VoiceOpen">
              <AudioIcon />
            </PLayerButton>
          )}
          {subtitles.length > 0 && (
            <PLayerButton handleAction={() => openModal("subtitle")} focuskey="SubtitleOpen">
              <SubtitleIcon />
            </PLayerButton>
          )}
          <PLayerButton handleAction={() => openModal("settings")} focuskey="SettingOpen">
            <div className="player-btn-icon-wrap">
              {qualityBadge && <span className="quality-badge">{qualityBadge}</span>}
              <SettingsIcon />
            </div>
          </PLayerButton>
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default ControlRow;
