// KeyboardWithCaretFake.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import Keyboard from "./Keyboard";
import SearchAction from "../Search/SearchAction";
import KeyBoardBtn from "../Search/KeyBoardBtn";
import FakeInput from "./FakeInput";
/* Custom display box with a blinking caret that you can click to reposition */

export default function KeyboardWithCaretFake({ onEnter }) {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up"],
  });
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);

  const insertAtCaret = (text) => {
    const left = value.slice(0, caret);
    const right = value.slice(caret);
    const next = left + text + right;
    setValue(next);
    setCaret(caret + text.length);
  };

  const onKeyboradEnter = () => {
    setIsShowKeyboard(!isShowKeyboard);
  };
  const handleKeyboardEvent = (evt) => {
    // 1) Characters -> insert
    if (typeof evt === "string") {
      if (evt === "delete" || evt === "enter") {
        // ignore old tokens if any slip through
        if (evt === "delete" && caret > 0) {
          setValue(value.slice(0, caret - 1) + value.slice(caret));
          setCaret(caret - 1);
        }
        if (evt === "enter") insertAtCaret("\n");
        return;
      }
      insertAtCaret(evt);
      return;
    }

    // 2) Actions -> handle by type (NEVER insert)
    if (!evt || typeof evt !== "object") return;

    switch (evt.type) {
      case "left":
        setCaret(Math.max(0, caret - 1));
        break;
      case "right":
        setCaret(Math.min(value.length, caret + 1));
        break;
      case "home":
        setCaret(0);
        break;
      case "end":
        setCaret(value.length);
        break;
      case "backspace":
        if (caret > 0) {
          setValue(value.slice(0, caret - 1) + value.slice(caret));
          setCaret(caret - 1);
        }
        break;
      case "delete":
        if (caret < value.length) {
          setValue(value.slice(0, caret) + value.slice(caret + 1));
        }
        break;
      case "enter":
        onEnter(value);
        break;
      case "tab":
        insertAtCaret("\t");
        break;
      default:
        break;
    }
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>
        <div style={{ display: "flex" }}>
          <FakeInput
            value={value}
            caret={caret}
            onSetCaret={setCaret}
            placeholder="کلمه مورد نظر  خود وارد کنید."
          />

          <SearchAction
            searchQuery={value}
            onEnterPress={() => onEnter(value)}
          />
          <KeyBoardBtn onEnterPress={onKeyboradEnter} />
        </div>

        <div style={{ height: 12 }} />

        {isShowKeyboard && <Keyboard keybordValue={handleKeyboardEvent} />}
      </div>
    </FocusContext.Provider>
  );
}
