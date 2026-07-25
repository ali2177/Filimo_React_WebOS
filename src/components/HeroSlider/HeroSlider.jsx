import React, { useEffect, useRef, useState } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import { uiStorage } from "@src/utils/uiStorage";
import "./HeroSlider.css";

const AUTO_ADVANCE_MS = 5000;

// Play button — page focus lands here first. Enter plays; Left/Down go to dots.
function PlayButton({ slide, onEnterPlay, onFocusModeSlider, onPlayFocusChange }) {
  const btn = slide?.btns?.[0];
  const label = btn?.link_text || slide?.link_text || "تماشا";

  const { ref, focused } = useFocusable({
    focusKey: "SLIDER_PLAY",
    onEnterPress: () => onEnterPlay(slide),
    onFocus: () => {
      onFocusModeSlider();
      // Focusing the play button pauses the slider's auto-advance.
      onPlayFocusChange(true);
    },
    // Leaving the play button lets auto-advance resume.
    onBlur: () => onPlayFocusChange(false),
    onArrowPress: (direction) => {
      if (direction === "left" || direction === "down") {
        setFocus("SLIDER_DOTS");
        return false;
      }
      if (direction === "up") {
        // Nothing sits above the play button — swallow Up so focus isn't lost.
        return false;
      }
      // Right returns focus to the navbar — same logic as the first movie-row
      // item (restores the last focused menu item, or falls back to the first).
      if (direction === "right") {
        // Record the play button as the last content focus so pressing Left in
        // the navbar returns here (same lastMovieFocus path the movie rows use).
        uiStorage.setItem("lastMovieFocus", "SLIDER_PLAY");
        setFocus(uiStorage.getItem("lastFocusMenuItem") || "menuItem__0");
        return false;
      }
      return true;
    },
  });

  return (
    <div
      ref={ref}
      className={`hero-play-btn u700 ${focused ? "hero-play-btn--focused" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => onEnterPlay(slide)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEnterPlay(slide);
        }
      }}
    >
      <svg
        className="hero-play-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9.45332 26.6666C9.15304 26.6818 8.85406 26.6174 8.58666 26.48C6.82666 25.44 6.66666 18.1066 6.66666 15.8933C6.66666 13.1066 6.85332 6.55996 8.57332 5.54663C10.3067 4.53329 16.0667 7.65329 18.4667 9.03996C20.4 10.1466 26.6667 13.9066 26.6667 16C26.6667 18.0933 21.0133 21.4933 18.5733 22.8933C16.4533 24.1066 11.76 26.6666 9.45332 26.6666Z"
          fill="currentColor"
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}

// Dots pager. Left = next slide, Right = prev (RTL); Right on the first dot
// returns to the play button; Up returns to the play button on any dot except
// the first (where Up does nothing); Down enters rows.
function Dots({
  slides,
  activeIndex,
  setActiveIndex,
  onDownToRows,
  onFocusModeSlider,
  showPlay,
}) {
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  const { ref, focused } = useFocusable({
    focusKey: "SLIDER_DOTS",
    onFocus: onFocusModeSlider,
    onArrowPress: (direction) => {
      const current = activeRef.current;
      if (direction === "left") {
        setActiveIndex((current + 1) % slides.length);
        return false;
      }
      if (direction === "right") {
        if (current === 0) {
          // On the first slide, Right returns to the play button — unless this
          // slide hides it (button_type "none"), in which case stay on the dots.
          if (showPlay) setFocus("SLIDER_PLAY");
        } else {
          setActiveIndex(current - 1);
        }
        return false;
      }
      if (direction === "down") {
        onDownToRows();
        return false;
      }
      if (direction === "up") {
        // On the first dot, Up does nothing (only Right returns to the play
        // button). On any other dot, Up jumps straight to the play button.
        // When the play button is hidden for this slide, Up does nothing.
        if (current !== 0 && showPlay) {
          setFocus("SLIDER_PLAY");
        }
        return false;
      }
      return true;
    },
  });

  return (
    <div
      ref={ref}
      className={`hero-dots ${focused ? "hero-dots--focused" : ""}`}
    >
      {slides.map((slide, i) => (
        <span
          key={slide.id ?? slide.uid ?? i}
          className={`hero-dot ${i === activeIndex ? "hero-dot--active" : ""}`}
          role="button"
          aria-label={`اسلاید ${i + 1}`}
          aria-current={i === activeIndex ? "true" : undefined}
          onClick={() => setActiveIndex(i)}
        />
      ))}
    </div>
  );
}

const HeroSlider = ({
  slides,
  activeIndex,
  setActiveIndex,
  onEnterPlay,
  onDownToRows,
  onFocusModeSlider,
  hidden = false,
}) => {
  const { ref, focusKey } = useFocusable({
    focusKey: "SLIDER_ROOT",
    saveLastFocusedChild: false,
    trackChildren: true,
  });

  // Auto-advance pauses only while the play button is focused.
  const [playFocused, setPlayFocused] = useState(false);

  const slide = slides[activeIndex] || slides[0];

  // Slides flagged button_type "none" have no play action, so hide the button.
  const showPlay = slide ? slide.button_type !== "none" : false;

  // The play button can't be focused when it isn't rendered, so treat a no-play
  // slide as "not focused" and let auto-advance keep running.
  const playActive = showPlay && playFocused;

  // Persist whether the current slide shows a play button so the movie rows know
  // where to send focus when the user presses Up back into the slider.
  useEffect(() => {
    uiStorage.setItem("sliderHasPlay", showPlay ? "1" : "0");
  }, [showPlay]);

  // Advance while the slider is visible and the play button isn't focused. This
  // keeps the slides rotating when focus is on the dots or the navbar, and stops
  // only when the user is parked on the play button.
  useEffect(() => {
    if (hidden || playActive || slides.length <= 1) return undefined;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [hidden, playActive, slides.length, setActiveIndex]);

  // When the active slide hides the play button, make sure focus isn't stranded
  // on the (now unmounted) button — send it to the dots instead. Covers both the
  // page's initial setFocus("SLIDER_PLAY") and advancing onto a no-play slide.
  useEffect(() => {
    if (hidden || showPlay) return;
    const current = getCurrentFocusKey();
    if (current === "SLIDER_PLAY" || !current) {
      setFocus("SLIDER_DOTS");
    }
  }, [hidden, showPlay, activeIndex]);

  if (!slide) return null;

  const title = slide.title || slide.parent_title || slide.movie_title || "";
  const desc = slide.desc || "";
  const scheduleText = slide.schedule?.text;
  const scheduleIcon = slide.schedule?.icon;

  return (
    <FocusContext.Provider value={focusKey}>
      {/* Stays mounted (kept focusable) even in movie mode so that pressing Up
          from the first row can return focus here; just visually hidden. */}
      <div
        ref={ref}
        className={`hero-slider ${hidden ? "hero-slider--hidden" : ""}`}
        role="group"
        aria-roledescription="اسلایدر"
        aria-label={title}
      >
        <span className="hero-slider-live" aria-live="polite">
          {title}
        </span>
        <div className="hero-slider-info">
          {/* Each row below always renders (empty rows keep their reserved
              height) so the play button sits at the same baseline on every
              slide. */}
          <div className="hero-slider-logo-row">
            {slide.logo ? (
              <img
                className="hero-slider-logo"
                src={slide.logo}
                alt={title}
                decoding="async"
              />
            ) : (
              <h1 className="hero-slider-title u700">{title}</h1>
            )}
          </div>

          <div className="hero-slider-meta">
            {slide.commingSoon ? (
              <span className="hero-slider-badge hero-slider-badge--soon u500">
                به زودی
              </span>
            ) : null}

            {slide.is_exclusive && slide.exclusive_icon ? (
              <span className="hero-slider-badge hero-slider-badge--exclusive u500">
                <img
                  className="hero-slider-badge-icon"
                  src={slide.exclusive_icon}
                  alt="اختصاصی"
                  decoding="async"
                />
              </span>
            ) : null}

            {scheduleText ? (
              <span className="hero-slider-schedule">
                {scheduleIcon ? (
                  <img
                    className="hero-slider-schedule-icon"
                    src={scheduleIcon}
                    alt=""
                    decoding="async"
                  />
                ) : null}
                <span className="u500">{scheduleText}</span>
              </span>
            ) : null}
          </div>

          <p className="hero-slider-desc u400">{desc}</p>

          {showPlay ? (
            <PlayButton
              slide={slide}
              onEnterPlay={onEnterPlay}
              onFocusModeSlider={onFocusModeSlider}
              onPlayFocusChange={setPlayFocused}
            />
          ) : null}
        </div>

        <Dots
          slides={slides}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onDownToRows={onDownToRows}
          onFocusModeSlider={onFocusModeSlider}
          showPlay={showPlay}
        />
      </div>
    </FocusContext.Provider>
  );
};

export default HeroSlider;
