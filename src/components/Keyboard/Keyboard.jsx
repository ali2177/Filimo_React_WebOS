import React, { useRef } from "react";
import { Focusable } from "react-js-spatial-navigation";
import Word from "./Word";
import ActionBtn from "./ActionBtn";

const persian = [
  "ا",
  "ب",
  "پ",
  "ت",
  "ث",
  "چ",
  "ج",
  "ح",
  "خ",
  "د",
  "ر",
  "ز",
  "ژ",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ک",
  "گ",
  "ل",
  "م",
  "ن",
  "و",
  "ه",
  "ی",
];

const english = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const Keyboard = ({ keybordValue }) => {
  const myRef = useRef(null);
  const handleWordPress = (item) => {
    keybordValue(item);
  };
  const handleActionPress = (type) => {
    if (type === "space") {
      keybordValue(" ");
    } else {
      keybordValue(type);
    }
  };
  const handleScrolling = () => {
    myRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  return (
    <div className="keyboard-wrapper">
      <div className="keyboard-persian-row">
        {persian.map((item) => (
          <div ref={myRef}>
            <Word
              onFocus={handleScrolling}
              onEnter={handleWordPress}
              item={item}
            />
          </div>
        ))}
      </div>
      <div className="keyboard-english-row">
        {english.map((item) => (
          <div ref={myRef}>
            <Word
              onFocus={handleScrolling}
              onEnter={handleWordPress}
              item={item}
            />
          </div>
        ))}
      </div>
      <div ref={myRef} className="keyboard-number-row">
        {numbers.map((item) => (
          <Word onFocus={handleScrolling} item={item} />
        ))}
        <ActionBtn
          onFocus={handleScrolling}
          onEnter={handleActionPress}
          type={"delete"}
        />
        <ActionBtn
          onFocus={handleScrolling}
          onEnter={handleActionPress}
          type={"space"}
        />
      </div>
    </div>
  );
};

export default Keyboard;
