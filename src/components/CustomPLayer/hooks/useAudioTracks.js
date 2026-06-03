import { useCallback, useEffect, useState } from "react";
import Hls from "hls.js";

export function useAudioTracks(hlsInstance) {
  const [audioTracks, setAudioTracks] = useState([]);
  const [activeAudioTrack, setActiveAudioTrack] = useState(-1);

  const syncAudioTracks = useCallback(() => {
    if (!hlsInstance) return;

    const tracks = hlsInstance.audioTracks.map((track, index) => ({
      index,
      id: track.id,
      name: track.name || track.lang || `Audio ${index + 1}`,
      lang: track.lang,
      default: track.default,
    }));

    setAudioTracks(tracks);
    setActiveAudioTrack(hlsInstance.audioTrack);
  }, [hlsInstance]);

  useEffect(() => {
    if (!hlsInstance) return;

    const handleAudioTracksUpdated = () => {
      syncAudioTracks();
    };

    const handleAudioTrackSwitched = (_event, data) => {
      setActiveAudioTrack(data.id);
    };

    hlsInstance.on(Hls.Events.AUDIO_TRACKS_UPDATED, handleAudioTracksUpdated);
    hlsInstance.on(Hls.Events.AUDIO_TRACK_SWITCHED, handleAudioTrackSwitched);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, handleAudioTracksUpdated);

    syncAudioTracks();

    return () => {
      hlsInstance.off(
        Hls.Events.AUDIO_TRACKS_UPDATED,
        handleAudioTracksUpdated
      );
      hlsInstance.off(
        Hls.Events.AUDIO_TRACK_SWITCHED,
        handleAudioTrackSwitched
      );
      hlsInstance.off(Hls.Events.MANIFEST_PARSED, handleAudioTracksUpdated);
    };
  }, [hlsInstance, syncAudioTracks]);

  const switchAudioTrack = useCallback(
    (trackIndex) => {
      if (!hlsInstance) return;

      const index = Number(trackIndex);
      if (Number.isNaN(index)) return;

      hlsInstance.audioTrack = index;
      setActiveAudioTrack(index);
    },
    [hlsInstance]
  );

  return {
    audioTracks,
    activeAudioTrack,
    switchAudioTrack,
  };
}
