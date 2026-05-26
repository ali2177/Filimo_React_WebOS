import React, { useState, useEffect } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../context/PlayerContext";
import SelectRow from "./SelectRow";
import NavRow from "./NavRow";
import ToggleRow from "./ToggleRow";
import { ChevronRightIcon } from "../sheetIcons";
import { isBackKey } from "../../utils/utils";
import "./SettingsSheet.css";

const SPEEDS = [
  { label: "۰.۲۵", value: 0.25 },
  { label: "۱.۰ (عادی)", value: 1.0 },
  { label: "۱.۲۵", value: 1.25 },
  { label: "۱.۵", value: 1.5 },
  { label: "۲", value: 2.0 },
];

// ─── SettingsSheet ────────────────────────────────────────────────────────────

const SettingsSheet = ({ onClose }) => {
  const {
    levels,
    selectedLevelIndex,
    changeQuality,
    playbackSpeed,
    changeSpeed,
    autoPlayNext,
    toggleAutoPlayNext,
  } = usePlayerContext();

  const [layer, setLayer] = useState("main");

  const { ref, focusKey } = useFocusable({
    focusKey: "settings-sheet",
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  useEffect(() => {
    if (layer === "main") {
      setFocus("st-quality");
    } else if (layer === "quality") {
      const key =
        selectedLevelIndex === -1
          ? "st-qual-auto"
          : `st-qual-${selectedLevelIndex}`;
      setFocus(key);
    } else if (layer === "speed") {
      const idx = SPEEDS.findIndex((s) => s.value === playbackSpeed);
      setFocus(`st-speed-${idx >= 0 ? idx : 1}`);
    }
  }, [layer]);

  // Capture-phase Backspace
  useEffect(() => {
    const handler = (e) => {
      if (!isBackKey(e)) return;
      e.stopImmediatePropagation();
      if (layer !== "main") {
        setLayer("main");
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [layer, onClose]);

  const qualityLabel =
    selectedLevelIndex === -1
      ? "خودکار"
      : levels[selectedLevelIndex]
        ? `${levels[selectedLevelIndex].height}p`
        : "خودکار";

  const speedLabel =
    SPEEDS.find((s) => s.value === playbackSpeed)?.label ?? "۱.۰";

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="settings-sheet">
        {/* ── Layer 1: main ── */}
        {layer === "main" && (
          <>
            <div className="st-header">
              <span className="st-title u500">تنظیمات</span>
            </div>
            <div className="st-list">
              <NavRow
                focusKey="st-quality"
                label="کیفیت تصویر"
                subLabel={qualityLabel}
                onEnter={() => setLayer("quality")}
              />
              <NavRow
                focusKey="st-speed"
                label="سرعت پخش"
                subLabel={speedLabel}
                onEnter={() => setLayer("speed")}
              />
              <ToggleRow
                focusKey="st-autoplay"
                label="پخش خودکار قسمت بعد"
                checked={autoPlayNext}
                onToggle={toggleAutoPlayNext}
              />
            </div>
          </>
        )}

        {/* ── Layer 2a: quality ── */}
        {layer === "quality" && (
          <>
            <div className="st-header st-header-back">
              <span className="st-title u500">کیفیت تصویر</span>
              <button className="st-back-btn" onClick={() => setLayer("main")}>
                {ChevronRightIcon}
              </button>
            </div>
            <div className="st-list">
              <SelectRow
                focusKey="st-qual-auto"
                label="کیفیت خودکار"
                subLabel="متناسب با اینترنت شما"
                isActive={selectedLevelIndex === -1}
                onEnter={() => {
                  changeQuality(-1);
                  setLayer("main");
                }}
              />
              {levels.map((l, i) => (
                <SelectRow
                  key={i}
                  focusKey={`st-qual-${i}`}
                  label={`${l.height}p`}
                  isActive={selectedLevelIndex === i}
                  onEnter={() => {
                    changeQuality(i);
                    setLayer("main");
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* ── Layer 2b: speed ── */}
        {layer === "speed" && (
          <>
            <div className="st-header st-header-back">
              <span className="st-title u500">سرعت پخش</span>
              <button className="st-back-btn" onClick={() => setLayer("main")}>
                {ChevronRightIcon}
              </button>
            </div>
            <div className="st-list">
              {SPEEDS.map((s, i) => (
                <SelectRow
                  key={i}
                  focusKey={`st-speed-${i}`}
                  label={s.label}
                  isActive={playbackSpeed === s.value}
                  onEnter={() => {
                    changeSpeed(s.value);
                    setLayer("main");
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

export default SettingsSheet;
