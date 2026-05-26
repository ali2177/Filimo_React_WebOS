import React, { useState, useEffect } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../context/PlayerContext";
import EpisodeRow from "./EpisodeRow";
import SeasonRow from "./SeasonRow";
import NavRow from "./NavRow";
import { ChevronRightIcon } from "../sheetIcons";
import { isBackKey } from "../../utils/utils";
import "./EpisodeSheet.css";

// ─── EpisodeSheet ─────────────────────────────────────────────────────────────

const EpisodeSheet = ({ onClose }) => {
  const { seriesData, onNextEpisode } = usePlayerContext();

  const initialSeasonIdx = Math.max(
    0,
    seriesData?.findIndex((s) => s.playing) ?? 0,
  );
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState(initialSeasonIdx);
  const [layer, setLayer] = useState("episodes");

  const currentSeason = seriesData?.[selectedSeasonIdx];

  const { ref, focusKey } = useFocusable({
    focusKey: "episode-sheet",
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  useEffect(() => {
    if (layer === "episodes") {
      const playingEp = currentSeason?.episode?.find((ep) => ep.playing);
      const firstEp = currentSeason?.episode?.[0];
      const uid = playingEp?.uid ?? firstEp?.uid;
      if (uid) setFocus(`es-ep-${uid}`);
      else setFocus("es-season-link");
    } else {
      setFocus(`es-season-${selectedSeasonIdx}`);
    }
  }, [layer, selectedSeasonIdx]);

  // Capture-phase Backspace so HlsTvPlayer's handler doesn't fire
  useEffect(() => {
    const handler = (e) => {
      if (!isBackKey(e)) return;
      e.stopImmediatePropagation();
      if (layer === "seasons") {
        setLayer("episodes");
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [layer, onClose]);

  if (!seriesData?.length) return null;

  const playEpisode = (uid) => onNextEpisode?.(uid);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="episode-sheet">
        {layer === "episodes" ? (
          <>
            <div className="es-header">
              <span className="es-title u500">انتخاب فصل و قسمت</span>
            </div>

            <NavRow
              focusKey="es-season-link"
              label={currentSeason?.title ?? ""}
              subLabel="انتخاب فصل"
              onEnter={() => setLayer("seasons")}
            />

            <div className="es-divider" />

            <div className="es-list">
              {currentSeason?.episode?.map((ep) => (
                <EpisodeRow
                  key={ep.uid}
                  focusKey={`es-ep-${ep.uid}`}
                  label={ep.title}
                  isPlaying={ep.playing}
                  onEnter={() => playEpisode(ep.uid)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="es-header es-header-back">
              <span className="es-title">انتخاب فصل</span>
              <button
                className="es-back-btn"
                onClick={() => setLayer("episodes")}
              >
                {ChevronRightIcon}
              </button>
            </div>

            <div className="es-list">
              {seriesData.map((season, i) => (
                <SeasonRow
                  key={i}
                  focusKey={`es-season-${i}`}
                  label={season.title}
                  isActive={i === selectedSeasonIdx}
                  onEnter={() => {
                    setSelectedSeasonIdx(i);
                    setLayer("episodes");
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default EpisodeSheet;
