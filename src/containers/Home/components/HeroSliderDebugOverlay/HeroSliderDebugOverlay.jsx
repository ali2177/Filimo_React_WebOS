import React, { useMemo, useState, useEffect } from "react";
import { getApiBaseUrl } from "@src/config/locale";

// Rebuild the exact home-list request the app makes (same path + headers as
// TMDB.js prepareHeaders) as a copy-pasteable curl, using this TV's real jwt.
const HOME_PATH =
  "movie/movie/list/tagid/1/list_perpage/9/list_offset/0/?devicetype=react_tizen&json_type=simple";

function buildCurl() {
  const url = `${getApiBaseUrl()}${HOME_PATH}`;
  const jwt = (() => {
    try {
      return localStorage.getItem("jwt") || "";
    } catch {
      return "";
    }
  })();
  const appUserAgent = JSON.stringify({
    os: "WebOs",
    an: "Filimo",
    vn: "1.00",
  });

  // The REAL browser identity of the device this runs on. On the TV these are
  // the WebOS engine's values — the thing the browser sets automatically and
  // the app never touches. Embedding them makes the curl reproduce the TV's
  // request from any machine (curl lets you override User-Agent; a browser
  // won't). Generate this ON THE TV to capture the TV's UA.
  const realUA =
    (typeof navigator !== "undefined" && navigator.userAgent) || "";
  const lang =
    (typeof navigator !== "undefined" &&
      (navigator.languages?.join(",") || navigator.language)) ||
    "";

  const lines = [`curl -s '${url}'`];
  if (jwt) lines.push(`  -H 'Authorization: Bearer ${jwt}'`);
  // App-set custom header (lowercase, JSON string) — see TMDB.js prepareHeaders.
  lines.push(`  -H 'UserAgent: ${appUserAgent}'`);
  // Browser-set headers captured live from this device:
  if (realUA) lines.push(`  -H 'User-Agent: ${realUA}'`);
  if (lang) lines.push(`  -H 'Accept-Language: ${lang}'`);
  return lines.join(" \\\n");
}

// The backend's dedicated slider-test tag. Fetched with the app's exact headers
// so it runs under real device conditions (the TV's own User-Agent is attached
// automatically by the browser; a desktop curl can't reproduce that).
const TEST_SLIDER_PATH =
  "movie/movie/list/tagid/2001695/?devicetype=react_tizen&json_type=simple";

async function fetchTestSlider() {
  const url = `${getApiBaseUrl()}${TEST_SLIDER_PATH}`;
  const headers = {
    UserAgent: JSON.stringify({ os: "WebOs", an: "Filimo", vn: "1.00" }),
  };
  try {
    const jwt = localStorage.getItem("jwt");
    if (jwt) headers.Authorization = `Bearer ${jwt}`;
  } catch {
    /* storage unavailable */
  }
  const res = await fetch(url, { method: "GET", headers });
  const json = await res.json();
  const headersliders = getHeaderSliders(json);
  const slides = headersliders?.data ?? [];
  return {
    status: res.status,
    count: slides.length,
    titles: slides.map(
      (s) => s.title || s.parent_title || s.movie_title || "(no title)",
    ),
  };
}

/**
 * TEMPORARY diagnostic overlay — remove once the "slider shows only 1 item on
 * some TVs" bug is confirmed/fixed.
 *
 * TVs have no terminal, so this renders the numbers on-screen (same idea as the
 * player's PlayerDebugOverlay). It answers one question: is the single-slide
 * report a stale localStorage cache rather than the live API?
 *
 * It compares three counts of the headerslider:
 *   • RENDERED — what <HeroSlider> is actually showing (sliderSlides.length)
 *   • FRESH    — what the live API returned this session (from `data`)
 *   • CACHED   — what is frozen in localStorage["lastdataloaded"]
 *
 * useHomeMovies prefers the cache and never re-syncs from FRESH once a cache
 * exists, so if CACHED < FRESH the overlay flags a stale cache as the cause.
 *
 * Toggle visibility with the remote digit "9", or click the badge.
 *
 * Remote digit "8" toggles a DATA panel that dumps the exact per-slide fields
 * the TV received (title / button_type / play link / logo & cover presence),
 * plus a scrollable full-JSON pretty-print — so you can confirm on-device what
 * the server actually sent, not just how many slides there are.
 */
function getHeaderSliders(payload) {
  const rows = payload?.data;
  if (!Array.isArray(rows)) return null;
  const sliderRow = rows.find((item) => item.output_type === "headerslider");
  return sliderRow?.headersliders ?? null;
}

function countSlides(payload) {
  const headersliders = getHeaderSliders(payload);
  if (!headersliders) return null;
  return headersliders.data?.length ?? 0;
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function HeroSliderDebugOverlay({
  sliderSlides,
  data,
  cacheKey = "lastdataloaded",
}) {
  const [visible, setVisible] = useState(true);
  const [showData, setShowData] = useState(false);
  const [showCurl, setShowCurl] = useState(false);
  const [test, setTest] = useState({ state: "idle" });

  const runTest = React.useCallback(() => {
    setTest({ state: "loading" });
    fetchTestSlider()
      .then((r) => setTest({ state: "done", ...r }))
      .catch((e) =>
        setTest({ state: "error", message: String(e?.message || e) }),
      );
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "9") setVisible((v) => !v);
      if (e.key === "8") setShowData((v) => !v);
      if (e.key === "7") setShowCurl((v) => !v);
      if (e.key === "6") runTest();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runTest]);

  const curl = useMemo(() => (showCurl ? buildCurl() : ""), [showCurl]);

  const rendered = sliderSlides?.length ?? 0;
  const fresh = useMemo(() => countSlides(data), [data]);

  // The raw `headersliders` field exactly as the server sent it this session.
  const headersliders = useMemo(() => getHeaderSliders(data), [data]);

  // Read straight from localStorage — this is the exact value useHomeMovies uses.
  const cached = useMemo(() => {
    const parsed = safeParse(localStorage.getItem(cacheKey));
    return { present: !!parsed?.data, count: countSlides(parsed) };
  }, [cacheKey, rendered, fresh]);

  const rows = [
    { label: "RENDERED", value: rendered, hint: "shown in slider" },
    {
      label: "FRESH",
      value: fresh == null ? "—" : fresh,
      hint: "live API this session",
    },
    {
      label: "CACHED",
      value: cached.present ? (cached.count ?? 0) : "none",
      hint: cached.present ? "localStorage lastdataloaded" : "no cache stored",
    },
  ];

  // Verdict: cache exists, has fewer slides than the API, and that's what's shown.
  const staleCache =
    cached.present &&
    fresh != null &&
    (cached.count ?? 0) < fresh &&
    rendered === (cached.count ?? 0);

  let verdict;
  if (staleCache) {
    verdict = {
      text: `STALE CACHE — showing ${cached.count} of ${fresh}. Clear localStorage.`,
      color: "#ff5252",
    };
  } else if (fresh != null && rendered < fresh) {
    verdict = {
      text: `RENDERED (${rendered}) < FRESH (${fresh}) — not the cache. Investigate.`,
      color: "#ffb300",
    };
  } else {
    verdict = {
      text: "counts match — server is returning all slides",
      color: "#69f0ae",
    };
  }

  const box = {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 2000000,
    background: "rgba(0,0,0,0.78)",
    color: "#fff",
    font: "12px/1.4 monospace",
    padding: "8px 10px",
    borderRadius: 6,
    pointerEvents: "auto",
  };

  if (!visible) {
    return (
      <div
        onClick={() => setVisible(true)}
        style={{ ...box, padding: "2px 6px", background: "rgba(0,0,0,0.6)" }}
      >
        SLIDER DBG (9)
      </div>
    );
  }

  return (
    <div style={box}>
      <div style={{ marginBottom: 4, opacity: 0.7 }}>
        HERO SLIDER LOG — press "9" to hide
      </div>
      {rows.map((r) => (
        <div key={r.label} style={{ whiteSpace: "nowrap" }}>
          <span
            style={{
              display: "inline-block",
              width: 78,
              color: "#90caf9",
              fontWeight: "bold",
            }}
          >
            {r.label}
          </span>
          <span style={{ fontWeight: "bold" }}>{r.value}</span>
          <span style={{ opacity: 0.6 }}> — {r.hint}</span>
        </div>
      ))}
      <div
        style={{
          marginTop: 6,
          color: verdict.color,
          fontWeight: "bold",
          whiteSpace: "normal",
          maxWidth: 320,
        }}
      >
        {verdict.text}
      </div>

      <div
        style={{ marginTop: 6, opacity: 0.7, cursor: "pointer" }}
        onClick={() => setShowData((v) => !v)}
      >
        {showData ? "▾" : "▸"} headersliders field — press "8"
      </div>

      {showData ? (
        <pre
          style={{
            marginTop: 4,
            maxWidth: 480,
            maxHeight: 320,
            overflow: "auto",
            background: "rgba(255,255,255,0.06)",
            padding: 8,
            borderRadius: 4,
            // pre (not pre-wrap): keep Prettier-style indent blocks intact and
            // let long values (URLs) scroll horizontally rather than wrap.
            whiteSpace: "pre",
            tabSize: 2,
            font: "11px/1.5 ui-monospace, Menlo, Consolas, monospace",
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "plaintext",
          }}
        >
          {headersliders == null
            ? "no headersliders field in this session's API data"
            : JSON.stringify(headersliders, null, 2)}
        </pre>
      ) : null}

      <div
        style={{ marginTop: 6, opacity: 0.7, cursor: "pointer" }}
        onClick={() => setShowCurl((v) => !v)}
      >
        {showCurl ? "▾" : "▸"} CURL (this TV's request) — press "7"
      </div>

      {showCurl ? (
        <pre
          style={{
            marginTop: 4,
            width: "100%",
            maxHeight: 300,
            overflow: "auto",
            background: "rgba(255,255,255,0.06)",
            padding: 8,
            borderRadius: 4,
            whiteSpace: "pre",
            font: "11px/1.5 ui-monospace, Menlo, Consolas, monospace",
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "plaintext",
            userSelect: "all",
          }}
          onClick={() => {
            try {
              navigator.clipboard?.writeText(curl);
            } catch {
              /* clipboard unavailable on TV — text is selectable instead */
            }
          }}
        >
          {curl}
        </pre>
      ) : null}

      <div
        style={{ marginTop: 6, opacity: 0.7, cursor: "pointer" }}
        onClick={runTest}
      >
        ↻ TEST API (tag 2001695) — press "6"
      </div>

      {test.state !== "idle" ? (
        <div style={{ marginTop: 4, whiteSpace: "normal", maxWidth: 340 }}>
          {test.state === "loading" ? (
            <span style={{ opacity: 0.7 }}>fetching…</span>
          ) : null}
          {test.state === "error" ? (
            <span style={{ color: "#ff5252" }}>error: {test.message}</span>
          ) : null}
          {test.state === "done" ? (
            <>
              <div
                style={{
                  fontWeight: "bold",
                  color: test.count > 1 ? "#69f0ae" : "#ff5252",
                }}
              >
                HTTP {test.status} · {test.count} slide
                {test.count === 1 ? "" : "s"}
                {test.count <= 1
                  ? " — one-slide bug reproduces here too"
                  : " — full slider on this device"}
              </div>
              {test.titles.map((t, i) => (
                <div
                  key={i}
                  style={{
                    opacity: 0.7,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {i + 1}. {t}
                </div>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
