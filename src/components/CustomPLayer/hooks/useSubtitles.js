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
  const lastSubtitleRef = useRef(null);
  const lastTextRef = useRef("");

  // Fetch available tracks from master playlist
  useEffect(() => {
    async function init() {
      const subs = await parseMasterPlaylistForSubtitles(src);
      setSubtitles(subs);
    }
    init();
  }, [src]);

  // Handle switching subtitle
  const switchSubtitle = async (label) => {
    const video = videoRef.current;
    if (!video) return;

    // "No Subtitles" — just clear active track, never touch playback
    if (label === null) {
      setActiveSubtitle(null);
      lastSubtitleRef.current = null;
        return;
    }

    const wasPlaying = !video.paused;
    video.pause();

    // Load segments if not cached
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

  // Update displayed subtitle text during playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSubtitle) {
      setSubtitleText("");
      return;
    }

    const subData = subtitleCache[activeSubtitle];
    if (!subData) return;

    let ticking = false;

    const updateSubtitle = async () => {
      if (ticking) return;
      ticking = true;

      const { segments, segmentDuration, loadedSegments } = subtitleCache[activeSubtitle];
      const segmentIndex = Math.floor(video.currentTime / segmentDuration);

      // Prefetch current + 2 segments
      for (let i = segmentIndex; i <= segmentIndex + 2; i++) {
        if (segments[i] && !loadedSegments.has(segments[i])) {
          const segCues = await fetchVttSegments(segments[i]);
          loadedSegments.add(segments[i]);
          setSubtitleCache((prev) => ({
            ...prev,
            [activeSubtitle]: {
              ...prev[activeSubtitle],
              cues: [...prev[activeSubtitle].cues, ...segCues],
              loadedSegments,
            },
          }));
        }
      }

      // Display active cue
      const activeCue = subtitleCache[activeSubtitle].cues.find(
        (c) => video.currentTime >= c.start && video.currentTime <= c.end
      );
      const displayCue = activeCue || lastSubtitleRef.current;
      const newText = displayCue ? displayCue.text : "";
      if (newText !== lastTextRef.current) {
        lastTextRef.current = newText;
        setSubtitleText(newText);
      }
      lastSubtitleRef.current = displayCue;

      ticking = false;
    };

    video.addEventListener("timeupdate", updateSubtitle);
    return () => video.removeEventListener("timeupdate", updateSubtitle);
  }, [activeSubtitle, subtitleCache, videoRef]);

  return { subtitles, activeSubtitle, subtitleText, switchSubtitle };
}
