// Resume playback after a seek WITHOUT depending solely on the `seeked` event.
// Seeking into an unbuffered region can stall so that `seeked` never fires,
// which left the player stuck on a black screen. Resume on any of the recovery
// events, and keep a watchdog that force-plays (and nudges to re-trigger HLS
// fragment loading) if nothing has happened in time.
//
// Shared by every seek path (seekbar click, keyboard scrub commit, ±15s buttons)
// so recovery behaves identically everywhere.
export function resumeAfterSeek(video, target) {
  if (!video) return;
  let done = false;
  const events = ["seeked", "canplay", "playing"];
  const cleanup = () => {
    events.forEach((e) => video.removeEventListener(e, resume));
    clearTimeout(watchdog);
  };
  const resume = () => {
    if (done) return;
    done = true;
    cleanup();
    video.play().catch(() => {});
  };
  events.forEach((e) => video.addEventListener(e, resume, { once: true }));

  // Watchdog: if still stalled at the seek target after 1.5s, kick it.
  const watchdog = setTimeout(() => {
    if (done) return;
    if (video.readyState < 3 && Math.abs(video.currentTime - target) < 0.5) {
      // nudge by a frame to force HLS to (re)load the segment at this position
      video.currentTime = target + 0.05;
    }
    video.play().catch(() => {});
  }, 1500);
}
