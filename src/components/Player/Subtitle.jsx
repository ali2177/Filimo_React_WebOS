import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const Subtitle = ({ sub, onTrackSet }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus: () => {
      // console.log("focus");
    },
    onEnterPress: () => {
      onTrackSet(sub.lng);
    },
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
    focusKey: "sub",
  });
  useEffect(() => {
    focusSelf();
    // alternatively
    // setFocus("sub");
  }, [focusSelf]);

  return (
    <div
      ref={ref}
      onClickEnter={() => {
        setTreackLang(sub.lng);
        setIsShowSubList(false);
      }}
      className={focused ? "sub-header-focus" : ""}
    >
      <li>{sub.lng_fa}</li>
    </div>
  );
};

export default Subtitle;
