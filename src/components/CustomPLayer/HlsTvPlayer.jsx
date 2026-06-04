import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useNavigate } from "react-router-dom";

import { useHls } from "./hooks/useHls.js";
import { useVideoTime } from "./hooks/useVideoTime.js";
import { useSubtitles } from "./hooks/useSubtitles.js";
import { useAudioTracks } from "./hooks/useAudioTracks.js";
import { usePlaybackControls } from "./hooks/usePlaybackControls.js";
import { useModal } from "./hooks/useModal.js";
import { useUiTimer } from "./hooks/useUiTimer.js";
import { usePlayerKeyboard } from "./hooks/usePlayerKeyboard.js";
import { useSkipIntro } from "./hooks/useSkipIntro.js";
import { useNextEpisode } from "./hooks/useNextEpisode.js";
import { useBuffering } from "./hooks/useBuffering.js";

import { PlayerContext } from "./context/PlayerContext.js";
import PlayerUi from "./components/PlayerUi/PlayerUI.jsx";
import PlayerSheet from "./components/PlayerSheet/PlayerSheet.jsx";
import SubtitleSheet from "./components/SubtitleSheet/SubtitleSheet.jsx";
import EpisodeSheet from "./components/EpisodeSheet/EpisodeSheet.jsx";
import AudioSheet from "./components/AudioSheet/AudioSheet.jsx";
import SettingsSheet from "./components/SettingsSheet/SettingsSheet.jsx";
import SkipIntroButton from "./components/SkipIntroButton/SkipIntroButton.jsx";
import NextEpisodeButton from "./components/NextEpisodeButton/NextEpisodeButton.jsx";
import "./HlsTvPlayer.css";

const HlsTvPlayer = ({
  src,
  movieTitle,
  movieFullTitle,
  movieSubtitle,
  isSeries,
  seriesData,
  introStart,
  introEnd,
  castData,
  onNextEpisode,
  autoPlay = true,
  resumeFrom = 0,
}) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // ─── Core hooks ──────────────────────────────────────────────────────────────
  const { hlsRef, hlsInstance, levels, actualLevelIndex, hlsError } = useHls(
    src,
    autoPlay,
    videoRef,
  );
  const { isBuffering } = useBuffering(videoRef);
  const { currentTime, duration, bufferedPercent } = useVideoTime(videoRef);
  const { subtitles, activeSubtitle, subtitleText, switchSubtitle } =
    useSubtitles(videoRef, src);
  const { audioTracks, activeAudioTrack, switchAudioTrack } =
    useAudioTracks(hlsInstance);

  const {
    playing,
    muted,
    playbackSpeed,
    autoPlayNext,
    selectedLevelIndex,
    togglePlay,
    toggleMute,
    seek,
    changeQuality,
    changeSpeed,
    toggleAutoPlayNext,
  } = usePlaybackControls(videoRef, hlsRef, duration);

  const { activeModal, openModal, closeModal } = useModal(videoRef);
  const { showNextEpisode, dismissNextEpisode } = useNextEpisode(
    currentTime,
    castData,
  );
  const { uiVisible, setUiVisible, resetUiTimer, forceHideUi } = useUiTimer(
    videoRef,
    activeModal !== null,
    showNextEpisode,
  );

  const { showSkipIntro, skipIntroRef, skipIntro } = useSkipIntro(
    currentTime,
    introStart,
    introEnd,
    videoRef,
  );

  usePlayerKeyboard({
    videoRef,
    uiVisible,
    activeModal,
    skipIntroRef,
    resetUiTimer,
    forceHideUi,
    closeModal: () => {
      closeModal();
      resetUiTimer();
    },
    navigate,
  });

  // ─── Resume from last watch position ─────────────────────────────────────────
  useEffect(() => {
    if (!resumeFrom || resumeFrom <= 0) return;
    const video = videoRef.current;
    if (!video) return;
    const applyResume = () => {
      video.currentTime = resumeFrom;
    };
    if (video.readyState >= 3) {
      applyResume();
    } else {
      video.addEventListener("canplay", applyResume, { once: true });
      return () => video.removeEventListener("canplay", applyResume);
    }
    // run only once on mount — resumeFrom is a fixed value from localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Spatial focus root ───────────────────────────────────────────────────────
  const { focusKey } = useFocusable({ focusKey: "player-root" });

  // ─── Subtitle appearance ─────────────────────────────────────────────────────
  const [subtitleStyle, setSubtitleStyle] = useState({
    color: "#ffffff",
    size: 1.0,
    background: "transparent",
  });
  const [showSubtitlePreview, setShowSubtitlePreview] = useState(false);
  const [subtitleRise, setSubtitleRise] = useState(false);

  const subtitleInlineStyle = useMemo(
    () => ({
      color: subtitleStyle.color,
      fontSize: `${subtitleStyle.size * 28}px`,
      backgroundColor: subtitleStyle.background,
      padding:
        subtitleStyle.background !== "transparent" ? "2px 10px" : undefined,
      borderRadius:
        subtitleStyle.background !== "transparent" ? "4px" : undefined,
    }),
    [subtitleStyle],
  );

  // ─── UI visibility side-effects ──────────────────────────────────────────────
  useEffect(() => {
    if (uiVisible) {
      setFocus(skipIntroRef.current ? "skip-intro-ui" : "Play");
      setSubtitleRise(true);
    } else {
      if (skipIntroRef.current) setFocus("skip-intro");
      setSubtitleRise(false);
      setSeekbarActive(false);
    }
  }, [uiVisible]);

  useEffect(() => {
    if (!showSkipIntro || uiVisible) return;
    setFocus("skip-intro");
  }, [showSkipIntro]);

  useEffect(() => {
    if (showNextEpisode) forceHideUi();
  }, [showNextEpisode]);

  // ─── Context value (memoised) ─────────────────────────────────────────────────
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const playerContextValue = useMemo(
    () => ({
      videoRef,
      playing,
      muted,
      currentTime,
      duration,
      bufferedPercent,
      progressPercent,
      subtitles,
      activeSubtitle,
      switchSubtitle,
      audioTracks,
      activeAudioTrack,
      switchAudioTrack,
      levels,
      selectedLevelIndex,
      actualLevelIndex,
      togglePlay,
      toggleMute,
      seek,
      changeQuality,
      playbackSpeed,
      changeSpeed,
      autoPlayNext,
      toggleAutoPlayNext,
      resetUiTimer,
      openModal,
      closeModal: () => {
        closeModal();
        resetUiTimer();
        setFocus("Play");
      },
      subtitleStyle,
      setSubtitleStyle,
      showSubtitlePreview,
      setShowSubtitlePreview,
      movieTitle,
      movieFullTitle,
      movieSubtitle,
      isSeries,
      seriesData,
      showSkipIntro,
      skipIntro,
      src,
      seekbarActive: false, // overridden by SeekBar via setSeekbarActive
      setSeekbarActive: () => {},
      onNextEpisode,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [
      playing,
      muted,
      currentTime,
      duration,
      bufferedPercent,
      subtitles,
      activeSubtitle,
      audioTracks,
      activeAudioTrack,
      levels,
      selectedLevelIndex,
      actualLevelIndex,
      playbackSpeed,
      autoPlayNext,
      subtitleStyle,
      showSubtitlePreview,
      showSkipIntro,
      resetUiTimer,
      closeModal,
    ],
  );

  // seekbarActive lives here so SeekBar can toggle it via context
  const [seekbarActive, setSeekbarActive] = useState(false);
  const contextWithSeekbar = useMemo(
    () => ({ ...playerContextValue, seekbarActive, setSeekbarActive }),
    [playerContextValue, seekbarActive],
  );

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <FocusContext.Provider value={{ focusKey }}>
      <PlayerContext.Provider value={contextWithSeekbar}>
        <div className="player-container">
          <video ref={videoRef} style={{ width: "100%", height: "100%" }} />

          {(subtitleText || showSubtitlePreview) && (
            <div
              className={`subtitle-overlay${subtitleRise ? " rise" : ""}${showSubtitlePreview ? " preview" : ""}`}
              style={subtitleInlineStyle}
            >
              {showSubtitlePreview ? "نمونه زیرنویس" : subtitleText}
            </div>
          )}

          {activeModal === "subtitle" && (
            <PlayerSheet
              onClose={() => {
                closeModal();
                resetUiTimer();
                setFocus("Play");
              }}
            >
              <SubtitleSheet
                onClose={() => {
                  closeModal();
                  resetUiTimer();
                  setFocus("Play");
                }}
              />
            </PlayerSheet>
          )}
          {activeModal === "episodes" && (
            <PlayerSheet
              onClose={() => {
                closeModal();
                resetUiTimer();
                setFocus("Play");
              }}
            >
              <EpisodeSheet
                onClose={() => {
                  closeModal();
                  resetUiTimer();
                  setFocus("Play");
                }}
              />
            </PlayerSheet>
          )}
          {activeModal === "audio" && (
            <PlayerSheet
              onClose={() => {
                closeModal();
                resetUiTimer();
                setFocus("Play");
              }}
            >
              <AudioSheet
                onClose={() => {
                  closeModal();
                  resetUiTimer();
                  setFocus("Play");
                }}
              />
            </PlayerSheet>
          )}
          {activeModal === "settings" && (
            <PlayerSheet
              onClose={() => {
                closeModal();
                resetUiTimer();
                setFocus("Play");
              }}
            >
              <SettingsSheet
                onClose={() => {
                  closeModal();
                  resetUiTimer();
                  setFocus("Play");
                }}
              />
            </PlayerSheet>
          )}

          {isBuffering && !hlsError && (
            <div className="player-buffering-overlay">
              <div className="player-spinner" />
            </div>
          )}

          {hlsError && (
            <div className="player-error-overlay">
              <span className="player-error-icon">⚠</span>
              <p className="player-error-title">خطا در پخش ویدیو</p>
              <p className="player-error-subtitle">
                {hlsError === "network"
                  ? "اتصال اینترنت را بررسی کنید"
                  : "پخش ویدیو امکان‌پذیر نیست"}
              </p>
            </div>
          )}

          {showSkipIntro && !uiVisible && (
            <SkipIntroButton onSkip={skipIntro} />
          )}

          {showNextEpisode && !uiVisible && (
            <NextEpisodeButton
              castData={castData}
              autoPlayNext={autoPlayNext}
              onNextEpisode={onNextEpisode}
              onDismiss={() => {
                dismissNextEpisode();
                setTimeout(() => resetUiTimer(), 0);
              }}
            />
          )}

          <div
            className="controls-wrapper"
            style={{ opacity: uiVisible && activeModal === null ? 1 : 0 }}
          >
            <PlayerUi />
          </div>
        </div>
      </PlayerContext.Provider>
    </FocusContext.Provider>
  );
};

export default HlsTvPlayer;
