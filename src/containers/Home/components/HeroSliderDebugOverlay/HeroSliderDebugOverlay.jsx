import React, { useMemo, useState, useEffect } from "react";

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
 */
function countSlides(payload) {
  const rows = payload?.data;
  if (!Array.isArray(rows)) return null;
  const sliderRow = rows.find((item) => item.output_type === "headerslider");
  if (!sliderRow) return null;
  return sliderRow.headersliders?.data?.length ?? 0;
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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "9") setVisible((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rendered = sliderSlides?.length ?? 0;
  const fresh = useMemo(() => countSlides(data), [data]);

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
      value: cached.present ? cached.count ?? 0 : "none",
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
    verdict = { text: "counts match — server is returning all slides", color: "#69f0ae" };
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
          <span style={{ display: "inline-block", width: 78, color: "#90caf9", fontWeight: "bold" }}>
            {r.label}
          </span>
          <span style={{ fontWeight: "bold" }}>{r.value}</span>
          <span style={{ opacity: 0.6 }}> — {r.hint}</span>
        </div>
      ))}
      <div style={{ marginTop: 6, color: verdict.color, fontWeight: "bold", whiteSpace: "normal", maxWidth: 320 }}>
        {verdict.text}
      </div>
    </div>
  );
}
