import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

const AlertBtn = ({ onEnterPress }) => {
  const { t } = useTranslation();
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onEnterPress,
    focusKey: "Alert-btn",
  });
  useEffect(() => {
    focusSelf();
  }, []);
  return (
    <button
      ref={ref}
      onMouseEnter={() => {
        setFocus("Alert-btn");
      }}
      onClick={onEnterPress}
      className={focused ? "alert-bnt u400 alert-bnt-focus" : "alert-bnt u400"}
    >
      {t("alert.ok")}
    </button>
  );
};

export default AlertBtn;
