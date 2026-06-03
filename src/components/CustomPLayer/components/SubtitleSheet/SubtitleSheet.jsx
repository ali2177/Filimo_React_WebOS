import React, { useState, useEffect, useRef } from "react";
import { isBackKey } from "../../utils/utils";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../context/PlayerContext";
import SheetRow from "./SheetRow";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ResetIcon,
} from "../sheetIcons";
import "./SubtitleSheet.css";

const TEXT_COLORS = [
  { label: "سفید", value: "#ffffff" },
  { label: "زرد", value: "#ffff00" },
  { label: "آبی روشن", value: "#00d0ff" },
  { label: "قرمز", value: "#ff4444" },
];

const TEXT_SIZES = [
  { label: "۸۰٪", value: 0.8 },
  { label: "۱۰۰٪", value: 1.0 },
  { label: "۱۲۰٪", value: 1.2 },
  { label: "۱۵۰٪", value: 1.5 },
];

const BG_OPTIONS = [
  { label: "هیچ", value: "transparent" },
  { label: "مشکی", value: "rgba(0,0,0,0.75)" },
  { label: "سفید", value: "rgba(255,255,255,0.6)" },
];

const DEFAULT_STYLE = {
  color: "#ffffff",
  size: 1.0,
  background: "transparent",
};

const LANG_MAP = {
  english: "زبان انگلیسی",
  arabic: "زبان عربی",
  persian: "زبان فارسی",
  farsi: "زبان فارسی",
  kurdish: "زبان کردی",
  ku: "زبان کردی",
  urdu: "زبان اردو",
  urd: "زبان اردو",
  ord: "زبان اردو",
  turkish: "زبان ترکی",
  french: "زبان فرانسوی",
  german: "زبان آلمانی",
  spanish: "زبان اسپانیایی",
  italian: "زبان ایتالیایی",
  russian: "زبان روسی",
  chinese: "زبان چینی",
  japanese: "زبان ژاپنی",
  korean: "زبان کره‌ای",
};

const getLangLabel = (label) => LANG_MAP[label?.toLowerCase()] ?? label;

const cycle = (arr, currentValue, delta) => {
  const idx = arr.findIndex((item) => item.value === currentValue);
  const safeIdx = idx >= 0 ? idx : 0;
  return arr[(safeIdx + delta + arr.length) % arr.length].value;
};

// Focus keys for the settings layer — constant, defined outside component
const SETTINGS_FOCUS_KEYS = [
  "ss-textcolor",
  "ss-textsize",
  "ss-background",
  "ss-reset",
];

// ─── SubtitleSheet ────────────────────────────────────────────────────────────

const SubtitleSheet = ({ onClose }) => {
  const {
    subtitles,
    activeSubtitle,
    switchSubtitle,
    subtitleStyle,
    setSubtitleStyle,
    setShowSubtitlePreview,
  } = usePlayerContext();

  const [layer, setLayer] = useState("main");

  // Tracks which focus key is currently active so the capture handler knows
  // where to navigate from, without relying on norigin's spatial detection.
  const currentFocusKeyRef = useRef(null);

  const { ref, focusKey } = useFocusable({
    focusKey: "subtitle-sheet",
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["up", "down"],
  });

  // When layer changes, restore focus to the correct starting row
  useEffect(() => {
    if (layer === "main") {
      setShowSubtitlePreview(false);
      const key = activeSubtitle ? `ss-lang-${activeSubtitle}` : "ss-lang-none";
      currentFocusKeyRef.current = key;
      setFocus(key);
    } else {
      setShowSubtitlePreview(true);
      currentFocusKeyRef.current = "ss-textcolor";
      setFocus("ss-textcolor");
    }
  }, [layer]);

  // Action handlers for each settings row — stored in a ref updated every render
  // so closures over setSubtitleStyle are always fresh (no stale state).
  const settingsArrowHandlersRef = useRef({});
  useEffect(() => {
    settingsArrowHandlersRef.current = {
      "ss-textcolor": {
        left: () =>
          setSubtitleStyle((s) => ({
            ...s,
            color: cycle(TEXT_COLORS, s.color, -1),
          })),
        right: () =>
          setSubtitleStyle((s) => ({
            ...s,
            color: cycle(TEXT_COLORS, s.color, 1),
          })),
        enter: () =>
          setSubtitleStyle((s) => ({
            ...s,
            color: cycle(TEXT_COLORS, s.color, 1),
          })),
      },
      "ss-textsize": {
        left: () =>
          setSubtitleStyle((s) => ({
            ...s,
            size: cycle(TEXT_SIZES, s.size, 1),
          })),
        right: () =>
          setSubtitleStyle((s) => ({
            ...s,
            size: cycle(TEXT_SIZES, s.size, -1),
          })),
        enter: () =>
          setSubtitleStyle((s) => ({
            ...s,
            size: cycle(TEXT_SIZES, s.size, 1),
          })),
      },
      "ss-background": {
        left: () =>
          setSubtitleStyle((s) => ({
            ...s,
            background: cycle(BG_OPTIONS, s.background, -1),
          })),
        right: () =>
          setSubtitleStyle((s) => ({
            ...s,
            background: cycle(BG_OPTIONS, s.background, 1),
          })),
        enter: () =>
          setSubtitleStyle((s) => ({
            ...s,
            background: cycle(BG_OPTIONS, s.background, 1),
          })),
      },
      "ss-reset": {
        enter: () => setSubtitleStyle(DEFAULT_STYLE),
      },
    };
  }); // no deps — refreshes every render so closures are always fresh

  // Single capture-phase keyboard handler: owns Back, Left, Right, Enter in settings layer.
  // Stopping propagation here prevents norigin's spatial engine from ever seeing
  // these keys, so focus movement is fully deterministic.
  useEffect(() => {
    const handler = (e) => {
      if (isBackKey(e)) {
        e.stopImmediatePropagation();
        if (layer === "settings") {
          setLayer("main");
        } else {
          setShowSubtitlePreview(false);
          onClose();
        }
        return;
      }

      if (layer === "settings") {
        const isLeft = e.key === "ArrowLeft" || e.keyCode === 37;
        const isRight = e.key === "ArrowRight" || e.keyCode === 39;
        const isEnter = e.key === "Enter" || e.keyCode === 13;
        if (isLeft || isRight || isEnter) {
          e.stopImmediatePropagation();
          const h =
            settingsArrowHandlersRef.current[currentFocusKeyRef.current];
          if (h) {
            if (isLeft) h.left?.();
            else if (isRight) h.right?.();
            else h.enter?.();
          }
        }
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [layer, onClose, subtitles]);

  const goToSettings = () => setLayer("settings");
  const goToMain = () => setLayer("main");

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className="subtitle-sheet">
        {layer === "main" ? (
          <>
            <div className="ss-header">
              <span className="ss-title u500">زیرنویس</span>
            </div>

            <div className="ss-list">
              {subtitles.map((s) => (
                <SheetRow
                  key={s.label}
                  focusKey={`ss-lang-${s.label}`}
                  label={getLangLabel(s.label)}
                  leftIcon={s.label === activeSubtitle ? CheckIcon : null}
                  onEnter={() => {
                    setShowSubtitlePreview(false);
                    switchSubtitle(s.label);
                    onClose();
                  }}
                />
              ))}
              <SheetRow
                focusKey="ss-lang-none"
                label="بدون زیرنویس"
                leftIcon={!activeSubtitle ? CheckIcon : null}
                onEnter={() => {
                  setShowSubtitlePreview(false);
                  switchSubtitle(null);
                  onClose();
                }}
              />
            </div>

            <div className="ss-divider" />

            <SheetRow
              focusKey="ss-settings-link"
              label="تنظیمات زیرنویس"
              subLabel="رنگ و اندازه متن"
              leftIcon={ChevronLeftIcon}
              onEnter={goToSettings}
            />
          </>
        ) : (
          <>
            <div className="ss-header ss-header-back">
              <span className="ss-title u500">تنظیمات زیرنویس</span>
              <button className="ss-back-btn" onClick={goToMain}>
                {ChevronRightIcon}
              </button>
            </div>

            <div className="ss-list">
              <SheetRow
                focusKey="ss-textcolor"
                onFocus={() => {
                  currentFocusKeyRef.current = "ss-textcolor";
                }}
                label="رنگ متن"
                subLabel={
                  TEXT_COLORS.find((c) => c.value === subtitleStyle.color)
                    ?.label ?? "سفید"
                }
                leftIcon={ChevronLeftIcon}
                onLeft={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    color: cycle(TEXT_COLORS, s.color, -1),
                  }))
                }
                onRight={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    color: cycle(TEXT_COLORS, s.color, 1),
                  }))
                }
                onEnter={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    color: cycle(TEXT_COLORS, s.color, 1),
                  }))
                }
              />
              <SheetRow
                focusKey="ss-textsize"
                onFocus={() => {
                  currentFocusKeyRef.current = "ss-textsize";
                }}
                label="اندازه متن"
                subLabel={
                  TEXT_SIZES.find((s) => s.value === subtitleStyle.size)
                    ?.label ?? "۱۰۰٪"
                }
                leftIcon={ChevronLeftIcon}
                onLeft={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    size: cycle(TEXT_SIZES, s.size, -1),
                  }))
                }
                onRight={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    size: cycle(TEXT_SIZES, s.size, 1),
                  }))
                }
                onEnter={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    size: cycle(TEXT_SIZES, s.size, 1),
                  }))
                }
              />
              <SheetRow
                focusKey="ss-background"
                onFocus={() => {
                  currentFocusKeyRef.current = "ss-background";
                }}
                label="پس زمینه"
                subLabel={
                  BG_OPTIONS.find((b) => b.value === subtitleStyle.background)
                    ?.label ?? "هیچ"
                }
                leftIcon={ChevronLeftIcon}
                onLeft={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    background: cycle(BG_OPTIONS, s.background, -1),
                  }))
                }
                onRight={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    background: cycle(BG_OPTIONS, s.background, 1),
                  }))
                }
                onEnter={() =>
                  setSubtitleStyle((s) => ({
                    ...s,
                    background: cycle(BG_OPTIONS, s.background, 1),
                  }))
                }
              />
              <SheetRow
                focusKey="ss-reset"
                onFocus={() => {
                  currentFocusKeyRef.current = "ss-reset";
                }}
                label="حالت پیش‌فرض"
                subLabel="بازگشت به حالت اولیه"
                leftIcon={ResetIcon}
                onEnter={() => setSubtitleStyle(DEFAULT_STYLE)}
              />
            </div>
          </>
        )}
      </div>
    </FocusContext.Provider>
  );
};

export default SubtitleSheet;
