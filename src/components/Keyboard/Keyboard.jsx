// Keyboard.jsx
import React, { useMemo, useState } from "react";
import {
  FocusContext,
  useFocusable,
} from "@noriginmedia/norigin-spatial-navigation";

import space from "../../assets/images/space-key.svg";
import globe from "../../assets/images/globe.svg";
import backspace from "../../assets/images/backspace.svg";

/* If you want PNG icons, import them and pass as `icon` props.
   For now I keep text labels to avoid broken imports. */

// Persian: digits shown → ASCII emitted
const faDigitMap = {
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "۰": "0",
};

// Persian shift alternates (extend as needed)
const faShiftMap = {
  ز: "ژ",
  ج: "[",
  چ: "]",
  ح: "}",
  خ: "{",
  پ: "\\",
  ف: "،",
  ا: "آ",
  "۰": "(",
  "۹": ")",
  "،": "؛",
  "/": "؟",
  ".": ":",
  // "و":"ؤ","ی":"ئ","ا":"آ","ه":"ۀ",
};

const isEnLetter = (ch) => /^[a-z]$/i.test(ch);
const applyEnCase = (ch, caps, shift) =>
  isEnLetter(ch) ? (caps || shift ? ch.toUpperCase() : ch.toLowerCase()) : ch;

function Key({ label, icon, span = 1, onPress, aria }) {
  const { ref, focused } = useFocusable({ onEnterPress: onPress });
  const spanClass = span > 1 ? `span-${span}` : "";

  return (
    <button
      ref={ref}
      className={`kb-key u500 ${aria === "space" && "space-bar"} ${spanClass} ${
        focused ? "focused" : ""
      }`}
      onClick={onPress}
      type="button"
      aria-label={aria || ""}
    >
      {icon ? (
        <img src={icon} alt={aria || label} className="kb-icon" />
      ) : (
        label
      )}
    </button>
  );
}

export default function Keyboard({ keybordValue }) {
  const [layout, setLayout] = useState("fa"); // "en" | "fa"
  const [caps, setCaps] = useState(false);
  const [shift, setShift] = useState(false); // one-shot

  const { ref, focusKey } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right"],
  });

  const emit = (v) => keybordValue(v);

  const faLabelWithShift = (ch) =>
    shift && layout === "fa" && faShiftMap[ch] ? faShiftMap[ch] : ch;

  const onKeyPress = (raw) => {
    const k = typeof raw === "string" ? { t: "text", v: raw } : raw;

    switch (k.t) {
      case "text": {
        let out = k.v;

        if (layout === "fa") {
          if (faDigitMap[out]) out = faDigitMap[out];
          else if (shift && faShiftMap[out]) out = faShiftMap[out];
          // emit STRING only
          emit(out);
          if (shift) setShift(false);
          return;
        }

        // English
        out = applyEnCase(out, caps, shift);
        emit(out); // STRING only
        if (shift) setShift(false);
        return;
      }

      case "space":
        emit(" ");
        return;

      // actions: emit OBJECTS only (never strings)
      case "backspace":
        emit({ type: "backspace" });
        return;
      case "deleteForward":
        emit({ type: "delete" });
        return;
      case "enter":
        emit({ type: "enter" });
        return;
      case "tab":
        emit({ type: "tab" });
        return;
      case "left":
        emit({ type: "left" });
        return;
      case "right":
        emit({ type: "right" });
        return;
      case "home":
        emit({ type: "home" });
        return;
      case "end":
        emit({ type: "end" });
        return;

      case "caps":
        if (layout === "en") setCaps((c) => !c);
        return;
      case "shift":
        setShift((s) => !s);
        return;
      case "lang":
        setLayout((l) => (l === "en" ? "fa" : "en"));
        setCaps(false);
        setShift(false);
        return;
      default:
        return;
    }
  };

  /* 14-column grid; adjust spans to taste */
  const enRows = useMemo(
    () => [
      [
        "=",
        "-",
        ..."0987654321".split(""),
        { t: "text", v: "`", label: "`" },
        { t: "backspace", icon: backspace, label: "backspace", span: 2 },
      ],
      [
        "\\",
        "[",
        "]",

        ..."poiuytrewq".split(""),

        { t: "tab", label: "tab", span: 2 },
      ],
      [
        { t: "enter", label: "search", span: 2 },
        "'",
        ";",
        ..."lkjhgfdsa".split(""),

        { t: "caps", label: "caps", span: 2 },
      ],
      [
        { t: "shift", label: "shift", span: 2 },
        "/",
        ".",
        ",",
        ..."mnbvcxz".split(""),

        { t: "shift", label: "shift", span: 3 },
      ],
      [
        { t: "right", label: "▶", span: 1 },
        { t: "left", label: "◀", span: 1 },

        { t: "space", icon: space, label: "", span: 9 },
        { t: "text", v: "@", label: "@", span: 1 },
        { t: "text", v: "com.", label: "com.", span: 2 },
        {
          t: "lang",
          icon: globe,
          label: layout === "en" ? "FA" : "EN",
          span: 1,
        },
      ],
    ],
    [layout]
  );

  const faRows = useMemo(
    () => [
      [
        "=",
        "-",
        ..."۰۹۸۷۶۵۴۳۲۱".split(""),
        { t: "text", v: "`", label: "`" },

        { t: "backspace", icon: backspace, label: "backspace", span: 2 },
      ],
      [..."پچجحخهعغفقثصض".split(""), { t: "tab", label: "tab", span: 2 }],
      [
        { t: "enter", label: "جستجو", span: 2 },
        ..."گکمنتالبیسش".split(""),
        { t: "caps", label: "caps", span: 2 }, // label stays English
      ],
      [
        { t: "shift", label: "shift", span: 2 },
        "/",
        ".",
        ",",
        ..."وئدذرزطظ".split(""),

        { t: "shift", label: "shift", span: 2 },
      ],
      [
        { t: "left", label: "▶", span: 1 },
        { t: "right", label: "◀", span: 1 },

        { t: "space", icon: space, label: "", span: 9 },
        { t: "text", v: "@", label: "@", span: 1 },
        { t: "text", v: "com.", label: "com.", span: 2 },
        {
          t: "lang",
          icon: globe,
          label: layout === "en" ? "FA" : "EN",
          span: 1,
        },
      ],
    ],
    [layout]
  );

  const rows = layout === "fa" ? faRows : enRows;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className={`kb-wrap ${layout === "fa" ? "fa-mode" : "en-mode"}`}
      >
        {rows.map((row, ri) => (
          <div className="kb-row" key={`r-${ri}`}>
            {row.map((it, i) => {
              const k =
                typeof it === "string" ? { t: "text", v: it, label: it } : it;
              let visual = k.label ?? k.v;
              if (k.t === "text") {
                visual =
                  layout === "fa"
                    ? faLabelWithShift(visual)
                    : applyEnCase(visual, caps, shift);
              }
              return (
                <Key
                  key={`k-${ri}-${i}`}
                  label={visual}
                  span={k.span || 1}
                  icon={k.icon}
                  aria={k.t}
                  onPress={() => onKeyPress(k)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </FocusContext.Provider>
  );
}
