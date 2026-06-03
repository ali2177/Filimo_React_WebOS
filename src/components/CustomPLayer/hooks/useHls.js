import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { parseMasterPlaylistForLevels } from "../utils/utils";

export function useHls(src, autoPlay, videoRef) {
  const hlsRef = useRef(null);
  const [hlsInstance, setHlsInstance] = useState(null);
  const [levels, setLevels] = useState([]);
  const [actualLevelIndex, setActualLevelIndex] = useState(-1);
  const [hlsError, setHlsError] = useState(null); // null | "network" | "fatal"

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHlsError(null);
    let networkRetries = 0;

    const hls = new Hls({
      renderTextTracksNatively: false,
      enableWorker: true,
      maxBufferLength: 20,
      backBufferLength: 20,
    });

    hls.loadSource(src);
    hls.attachMedia(video);
    hlsRef.current = hls;
    setHlsInstance(hls);

    hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
      setActualLevelIndex(data.level);
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (!autoPlay) return;
      video.play().catch(() => {
        // Browser blocked unmuted autoplay — fall back to muted
        video.muted = true;
        video.play().catch(() => {});
      });
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (!data.fatal) return;

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR && networkRetries < 3) {
        networkRetries++;
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        setHlsError(data.type === Hls.ErrorTypes.NETWORK_ERROR ? "network" : "fatal");
        hls.destroy();
      }
    });

    return () => {
      hls.destroy();
      hlsRef.current = null;
      setHlsInstance(null);
    };
  }, [src, autoPlay, videoRef]);

  useEffect(() => {
    parseMasterPlaylistForLevels(src).then(setLevels);
  }, [src]);

  return { hlsRef, hlsInstance, levels, actualLevelIndex, hlsError };
}
