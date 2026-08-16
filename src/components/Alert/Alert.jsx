import React from "react";
import { useTranslation } from "react-i18next";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import AlertBtn from "./AlertBtn";
const Alert = ({ type, handleBtnEnter }) => {
  const { t } = useTranslation();
  const { ref, focusKey } = useFocusable({
    isFocusBoundary: true,
    focusKey: "Alert-boundary",
  });
  if (type === "error_player") {
    return (
      <div className="infoo alert-network">
        <div className="alert-content">
          <div>
            {type === "error_player" && (
              <p className="u700">{t("alert.networkError")}</p>
            )}
          </div>
          {/* <AlertBtn onEnterPress={handleBtnEnter} /> */}
        </div>
      </div>
    );
  } else {
    return (
      <FocusContext.Provider value={focusKey}>
        <div ref={ref} className="infoo alert">
          <div className="alert-content">
            <div>
              {type === "error" && <p className="u700">{t("alert.loadError")}</p>}
              {type === "movie_rent" && (
                <p className="u700">{t("alert.movieRent")}</p>
              )}
              {type === "pay" && <p className="u700">{t("alert.pay")}</p>}
            </div>

            <AlertBtn onEnterPress={handleBtnEnter} />
          </div>
        </div>
      </FocusContext.Provider>
    );
  }
};

export default Alert;
