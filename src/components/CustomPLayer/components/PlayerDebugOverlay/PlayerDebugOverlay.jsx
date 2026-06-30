import React, { useEffect, useState, useRef } from "react";
import Hls from "hls.js";

/**
 * TEMPORARY diagnostic overlay — remove once the "sudden pausing" bug is found.
 *
 * Renders an on-screen log (TV has no terminal) that records every reason the
 * main <video> changes play state:
 *   • PAUSE(call)  — something called video.pause() in JS. The caller stack is
 *                    shown so you can see WHICH handler did it.
 *   • PAUSE(evt)   — the element fired a `pause` event.
 *   • PLAY / PLAYING
 *   • WAITING / STALLED — native buffer underrun (looks like a pause but no
 *                         pause() was called → it's a stall, not a toggle).
 *   • SEEKING / SEEKED / RATECHANGE
 *
 * It also logs HLS.js events so a quality switch that triggers a stall is
 * labeled (LEVEL_SWITCH / buffer flush / fragment errors).
 *
 * Toggle visibility with the remote: press the colored/▶︎ button mapped to the
 * digit "0", or click the badge in the corner.
 */
export default function PlayerDebugOverlay({ videoRef, hlsRef }) {
  const [logs, setLogs] = useState([]);
  const [visible, setVisible] = useState(true);
  const seqRef = useRef(0);
  const pushRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const push = (label, detail) => {
      const now = new Date();
      const ts = `${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds(),
      ).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;
      seqRef.current += 1;
      const entry = {
        id: seqRef.current,
        ts,
        label,
        detail: detail || "",
        t: video.currentTime ? video.currentTime.toFixed(1) : "0",
      };
      // keep only the last 40 entries
      setLogs((prev) => [entry, ...prev].slice(0, 40));
    };
    pushRef.current = push;

    // ── Wrap video.pause() so we capture the JS caller stack ──────────────────
    const originalPause = video.pause.bind(video);
    video.pause = function patchedPause(...args) {
      const stack = new Error().stack || "";
      // grab the first 3 stack frames after this wrapper, trimmed for the screen
      const caller = stack
        .split("\n")
        .slice(2, 5)
        .map((l) =>
          l
            .trim()
            .replace(/^at\s+/, "")
            .replace(/\s+\(.*\)$/, "")
            .replace(/https?:\/\/[^/]+/, ""),
        )
        .join(" ← ");
      push("PAUSE(call)", caller);
      return originalPause(...args);
    };

    const onPause = () =>
      push("pause(evt)", video.seeking ? "while seeking" : "");
    const onPlay = () => push("play");
    const onPlaying = () => push("playing");
    const onWaiting = () => push("WAITING", "buffer underrun / stall");
    const onStalled = () => push("STALLED", "no data");
    const onSeeking = () => push("seeking");
    const onSeeked = () => push("seeked");
    const onRateChange = () => push("ratechange", `rate=${video.playbackRate}`);

    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("ratechange", onRateChange);

    // ── Remote key "0" toggles the panel ──────────────────────────────────────
    const onKey = (e) => {
      if (e.key === "0") setVisible((v) => !v);
    };
    window.addEventListener("keydown", onKey);

    push("DEBUG", "overlay attached");

    return () => {
      video.pause = originalPause;
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("ratechange", onRateChange);
      window.removeEventListener("keydown", onKey);
    };
  }, [videoRef]);

  // ── HLS.js events (quality switch / buffer flush / fragment errors) ──────────
  useEffect(() => {
    let hls = null;
    let detach = () => {};

    const subscribe = (instance) => {
      hls = instance;
      const log = (label, detail) =>
        pushRef.current && pushRef.current(label, detail);

      const onSwitching = (_e, d) => {
        const h = instance.levels?.[d.level]?.height;
        log("LEVEL_SWITCHING", `→ lvl ${d.level}${h ? ` (${h}p)` : ""}`);
      };
      const onSwitched = (_e, d) => {
        const h = instance.levels?.[d.level]?.height;
        log("LEVEL_SWITCHED", `lvl ${d.level}${h ? ` (${h}p)` : ""}`);
      };
      const onBufferFlush = () => log("BUFFER_FLUSH", "buffer cleared");
      const onError = (_e, d) =>
        log("HLS_ERROR", `${d.details}${d.fatal ? " (FATAL)" : ""}`);

      instance.on(Hls.Events.LEVEL_SWITCHING, onSwitching);
      instance.on(Hls.Events.LEVEL_SWITCHED, onSwitched);
      instance.on(Hls.Events.BUFFER_FLUSHING, onBufferFlush);
      instance.on(Hls.Events.ERROR, onError);

      detach = () => {
        instance.off(Hls.Events.LEVEL_SWITCHING, onSwitching);
        instance.off(Hls.Events.LEVEL_SWITCHED, onSwitched);
        instance.off(Hls.Events.BUFFER_FLUSHING, onBufferFlush);
        instance.off(Hls.Events.ERROR, onError);
      };
    };

    // hlsRef may not be populated on first render — poll briefly until it is.
    const interval = setInterval(() => {
      const instance = hlsRef?.current;
      if (instance && instance !== hls) {
        detach();
        subscribe(instance);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      detach();
    };
  }, [hlsRef]);

  const colorFor = (label) => {
    if (label.startsWith("PAUSE") || label === "HLS_ERROR") return "#ff5252";
    if (label === "WAITING" || label === "STALLED" || label === "BUFFER_FLUSH")
      return "#ffb300";
    if (label === "play" || label === "playing") return "#69f0ae";
    if (label.startsWith("LEVEL_")) return "#ce93d8";
    return "#90caf9";
  };

  if (!visible) {
    return (
      <div
        onClick={() => setVisible(true)}
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 2000000,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          font: "12px monospace",
          padding: "2px 6px",
          borderRadius: 4,
        }}
      >
        DBG (0)
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 8,
        left: 8,
        maxHeight: "60%",
        overflow: "hidden",
        zIndex: 2000000,
        background: "rgba(0,0,0,0.78)",
        color: "#fff",
        font: "12px/1.35 monospace",
        padding: "8px 10px",
        borderRadius: 6,
        pointerEvents: "none",
      }}
    >
      <div style={{ marginBottom: 4, opacity: 0.7 }}>
        VIDEO STATE LOG — press "0" to hide
      </div>
      {logs.map((l) => (
        <div
          key={l.id}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span style={{ opacity: 0.6 }}>{l.ts} </span>
          <span style={{ opacity: 0.6 }}>t={l.t} </span>
          <span style={{ color: colorFor(l.label), fontWeight: "bold" }}>
            {l.label}
          </span>
          {l.detail ? (
            <span style={{ opacity: 0.85 }}> — {l.detail}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
