import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { use } from "react";

const AlertBtn = ({ onEnterPress }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onEnterPress,
    focusKey: "Alert-btn",
  });
  useEffect(() => {
    focusSelf();
  }, []);
  return (
    <button
      onMouseEnter={() => {
        setFocus("Alert-btn");
      }}
      onClick={onEnterPress}
      className={focused ? "alert-bnt u400 alert-bnt-focus" : "alert-bnt u400"}
    >
      متوجه شدم
    </button>
  );
};

export default AlertBtn;
