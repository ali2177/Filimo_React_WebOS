import React from "react";
import { useTranslation } from "react-i18next";
import AlertBtn from "./AlertBtn";
const Alert = ({ type, handleBtnEnter }) => {
  const { t } = useTranslation();
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
      <div className="infoo alert">
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
    );
  }
};

export default Alert;
