import React, { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useBackKey } from "@src/hooks/useBackKey";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { getLanguage, setLanguage } from "@src/config/locale";
import "./Settings.css";

// Toggling language is boot-time-only state: persist, then reload so every
// module (spatial-nav rtl, <html dir>, i18next, API base URL) re-derives fresh.
const applyLanguage = (next) => {
  setLanguage(next);
  window.location.reload();
};

const LanguageRow = () => {
  const { t } = useTranslation();
  const current = getLanguage();
  const toggle = () => applyLanguage(current === "fa" ? "en" : "fa");

  const { ref, focused, focusKey } = useFocusable({ onEnterPress: toggle });

  const value =
    current === "fa"
      ? t("settings.languageValueFa")
      : t("settings.languageValueEn");

  return (
    <div
      ref={ref}
      className={focused ? "settings-row settings-row-focus" : "settings-row"}
      onMouseEnter={() => setFocus(focusKey)}
      onClick={toggle}
    >
      <span className="settings-row-label u700">{t("settings.language")}</span>
      <span className="settings-row-value u500">{value}</span>
    </div>
  );
};

function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { ref, focusKey, focusSelf } = useFocusable({
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  const handleBack = useCallback(() => {
    if (location.pathname !== "/player") navigate(-1);
  }, [location.pathname, navigate]);
  useBackKey(handleBack);

  useEffect(() => {
    window.scrollTo(0, 0);
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <main ref={ref} className="settings-page">
        <h1 className="settings-title u700">{t("settings.title")}</h1>
        <div className="settings-list">
          <LanguageRow />
        </div>
      </main>
    </FocusContext.Provider>
  );
}

export default Settings;
