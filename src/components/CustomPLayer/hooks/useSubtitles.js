// hooks/useSubtitles.js
import { useEffect, useRef, useState } from "react";
import {
  fetchVttSegments,
  parseMasterPlaylistForSubtitles,
  parseSubtitleSegments,
} from "../utils/utils";

export function useSubtitles(videoRef, src) {
  const [subtitles, setSubtitles] = useState([]); // available tracks
  const [activeSubtitle, setActiveSubtitle] = useState(null);
  const [subtitleCache, setSubtitleCache] = useState({});
  const [subtitleText, setSubtitleText] = useState("");

  // Segment-boundary tracking — state change triggers the prefetch effect
  const [segmentIndex, setSegmentIndex] = useState(-1);
  const segmentIndexRef = useRef(-1);

  const lastSubtitleRef     = useRef(null);
  const lastSubtitleTextRef = useRef("");

  // Fetch available tracks from master playlist
  useEffect(() => {
    async function init() {
      const subs = await parseMasterPlaylistForSubtitles(src);
      setSubtitles(subs);
    }
    init();
  }, [src]);

  // Handle switching subtitle track
  const switchSubtitle = async (label) => {
    const video = videoRef.current;
    if (!video) return;

    if (label === null) {
      setActiveSubtitle(null);
      lastSubtitleRef.current = null;
      return;
    }

    const wasPlaying = !video.paused;
    video.pause();

    if (!subtitleCache[label]) {
      const track = subtitles.find((s) => s.label === label);
      if (!track) {
        if (wasPlaying) video.play().catch(() => {});
        return;
      }
      const { segments, segmentDuration } = await parseSubtitleSegments(track.uri);
      setSubtitleCache((prev) => ({
        ...prev,
        [label]: { segments, segmentDuration, cues: [], loadedSegments: new Set() },
      }));
    }

    setActiveSubtitle(label);
    if (wasPlaying) video.play().catch(() => {});
    return label;
  };

  // ── Prefetch effect — runs only when the player crosses a segment boundary ──
  // Keeps async network calls entirely out of the timeupdate hot path
  useEffect(() => {
    if (!activeSubtitle || segmentIndex < 0) return;
    const subData = subtitleCache[activeSubtitle];
    if (!subData) return;
    const { segments, loadedSegments } = subData;

    const prefetch = async () => {
      for (let i = segmentIndex; i <= segmentIndex + 2; i++) {
        if (segments[i] && !loadedSegments.has(segments[i])) {
          const segCues = await fetchVttSegments(segments[i]);
          loadedSegments.add(segments[i]);
          setSubtitleCache((prev) => {
            if (!prev[activeSubtitle]) return prev;
            return {
              ...prev,
              [activeSubtitle]: {
                ...prev[activeSubtitle],
                cues: [...prev[activeSubtitle].cues, ...segCues],
                loadedSegments,
              },
            };
          });
        }
      }
    };
    prefetch();
  // subtitleCache intentionally excluded: we only want to re-prefetch when
  // the segment boundary advances, not on every cache write
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentIndex, activeSubtitle]);

  // ── Lightweight timeupdate handler — cue lookup only, no network I/O ────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSubtitle) {
      setSubtitleText("");
      return;
    }
    const subData = subtitleCache[activeSubtitle];
    if (!subData) return;

    const { segmentDuration, cues } = subData;

    const updateSubtitle = () => {
      // Advance segment index only when playback crosses a boundary
      const newIdx = Math.floor(video.currentTime / segmentDuration);
      if (newIdx !== segmentIndexRef.current) {
        segmentIndexRef.current = newIdx;
        setSegmentIndex(newIdx);
      }

      // Find the cue for this timestamp
      const activeCue = cues.find(
        (c) => video.currentTime >= c.start && video.currentTime <= c.end
      );
      const displayCue = activeCue || lastSubtitleRef.current;
      const newText    = displayCue ? displayCue.text : "";

      // Skip the state update when the displayed text has not changed
      if (newText !== lastSubtitleTextRef.current) {
        lastSubtitleTextRef.current = newText;
        setSubtitleText(newText);
      }
      lastSubtitleRef.current = displayCue;
    };

    video.addEventListener("timeupdate", updateSubtitle);
    return () => video.removeEventListener("timeupdate", updateSubtitle);
  }, [activeSubtitle, subtitleCache, videoRef]);

  return { subtitles, activeSubtitle, subtitleText, switchSubtitle };
}
