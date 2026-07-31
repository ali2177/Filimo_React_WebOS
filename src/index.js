import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./components/AuthProvider";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./app/App";
import { getLanguage, isRtl } from "./config/locale";
import "./app/i18n";

import "./index.css";

// Reflect the current language on <html> before first paint (localStorage is
// synchronous, so no FOUC). Replaces the static lang/dir in public/index.html.
const lang = getLanguage();
document.documentElement.lang = lang;
document.documentElement.dir = isRtl(lang) ? "rtl" : "ltr";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </AuthProvider>
);
