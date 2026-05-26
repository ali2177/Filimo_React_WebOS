import React from "react";

import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { usePlayerContext } from "../../../../context/PlayerContext";

import "./PlayerButton.css";

const PLayerButton = ({
  onFocus,
  onEnterPress,
  focuskey,
  handleAction,
  children,
}) => {
  const { showSkipIntro } = usePlayerContext();

  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onArrowPress: (e) => {
      if (e === "down") {
        setFocus("seekbar");
        return false;
      }
      if (e === "up" && showSkipIntro) {
        setFocus("skip-intro-ui");
        return false;
      }
    },
    onEnterPress: () => {
      handleAction();
    },
    focusKey: focuskey,
  });

  // useEffect(() => {
  //   console.log(focusKey);
  //   setFocus("paly-btn");
  //   // focusSelf();
  // }, [focusSelf]);
  // useEffect(() => {
  //   console.log(focusKey);
  //   focusSelf();
  // }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className={
          focused
            ? "Player-button Player-button-focus u400"
            : "Player-button u400"
        }
        onMouseEnter={() => {
          setFocus(focusKey);
        }}
        onClick={handleAction}
      >
        {children}
      </div>
    </FocusContext.Provider>
  );
};

export default PLayerButton;
