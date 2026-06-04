import React, { useEffect } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../context/PlayerContext";
import AudioRow from "./AudioRow";
import { isBackKey } from "../../utils/utils";
import "./AudioSheet.css";

const LANG_LABELS = {
  fa: "فارسی",
  per: "فارسی",
  fas: "فارسی",
  en: "انگلیسی",
  eng: "انگلیسی",
  ar: "عربی",
  ara: "عربی",
};

const trackLabel = (track) => {
  const byLang = track.lang && LANG_LABELS[track.lang.toLowerCase()];
  if (byLang) return byLang;
  const byName = track.name && LANG_LABELS[track.name.toLowerCase()];
  if (byName) return byName;
  return track.name || track.lang || `صدا ${track.index + 1}`;
};

// ─── AudioSheet ───────────────────────────────────────────────────────────────

const AudioSheet = ({ onClose }) => {
  const { audioTracks, activeAudioTrack, switchAudioTrack } = usePlayerContext();

  const { ref, focusKey } = useFocusable({
    focusKey: "audio-sheet",
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  useEffect(() => {
    const defaultKey =
      activeAudioTrack >= 0
        ? `as-track-${activeAudioTrack}`
        : audioTracks.length > 0
        ? `as-track-0`
        : null;
    if (defaultKey) setFocus(defaultKey);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!isBackKey(e)) return;
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [onClose]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="audio-sheet">
        <div className="as-header">
          <span className="as-title">تغییر زبان</span>
        </div>

        <div className="as-list">
          {audioTracks.map((track) => (
            <AudioRow
              key={track.index}
              focusKey={`as-track-${track.index}`}
              label={trackLabel(track)}
              isActive={track.index === activeAudioTrack}
              onEnter={() => {
                switchAudioTrack(track.index);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default AudioSheet;
