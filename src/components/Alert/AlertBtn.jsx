import React from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const AlertBtn = ({ onEnterPress }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onEnterPress,
    focusKey: "Alert-btn",
  });
  return (
    <button
      className={focused ? "alert-bnt u400 alert-bnt-focus" : "alert-bnt u400"}
    >
      متوجه شدم
    </button>
  );
};

export default AlertBtn;
