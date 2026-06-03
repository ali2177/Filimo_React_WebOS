import React, { useEffect } from "react";
import { Focusable } from "react-js-spatial-navigation";
import {
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import NetworkErrorBtn from "./NetworkErrorBtn";

const NetworkError = ({
  errorText = "در این لیست فیلم یا سریالی برای نمایش وجود ندارد",
  type,
}) => {
  const { ref, focused, focusKey } = useFocusable({
    onEnterPress: () => {},
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "left"],
  });

  // useEffect(() => {
  //   console.log("set focus on error btn");
  //   setFocus("netError-btn");
  // }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <main
        ref={ref}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
        className="main"
      >
        <div display="flex" justifyContent="center">
          <p className="u700">{errorText}</p>
          {type === "forbiden" && <NetworkErrorBtn />}
          {/* <NetworkErrorBtn /> */}
        </div>
      </main>
    </FocusContext.Provider>
  );
};

export default NetworkError;
