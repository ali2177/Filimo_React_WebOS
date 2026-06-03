import { renderHook, act } from "@testing-library/react";
import { usePlaybackControls } from "../usePlaybackControls";

const makeVideoRef = ({ paused = true, muted = false, currentTime = 0 } = {}) => {
  const listeners = {};
  const video = {
    paused,
    muted,
    currentTime,
    playbackRate: 1,
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    addEventListener: jest.fn((event, cb) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
    }),
    removeEventListener: jest.fn(),
    _emit: (event) => listeners[event]?.forEach((cb) => cb()),
  };
  return { current: video };
};

const makeHlsRef = () => ({
  current: { currentLevel: -1, loadLevel: -1 },
});

describe("usePlaybackControls — initial state", () => {
  test("playing is false, muted is false, speed is 1.0, selectedLevel is -1", () => {
    const { result } = renderHook(() =>
      usePlaybackControls(makeVideoRef(), makeHlsRef(), 3600)
    );
    expect(result.current.playing).toBe(false);
    expect(result.current.muted).toBe(false);
    expect(result.current.playbackSpeed).toBe(1.0);
    expect(result.current.selectedLevelIndex).toBe(-1);
  });
});

describe("usePlaybackControls — togglePlay", () => {
  test("calls video.play() when paused", () => {
    const videoRef = makeVideoRef({ paused: true });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.togglePlay(); });
    expect(videoRef.current.play).toHaveBeenCalledTimes(1);
  });

  test("calls video.pause() when playing", () => {
    const videoRef = makeVideoRef({ paused: false });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.togglePlay(); });
    expect(videoRef.current.pause).toHaveBeenCalledTimes(1);
  });

  test("playing state updates when the video fires play event", () => {
    const videoRef = makeVideoRef({ paused: true });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { videoRef.current._emit("play"); });
    expect(result.current.playing).toBe(true);
  });

  test("playing state updates when the video fires pause event", () => {
    const videoRef = makeVideoRef({ paused: false });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { videoRef.current._emit("play"); });
    act(() => { videoRef.current._emit("pause"); });
    expect(result.current.playing).toBe(false);
  });
});

describe("usePlaybackControls — toggleMute", () => {
  test("flips video.muted from false to true", () => {
    const videoRef = makeVideoRef({ muted: false });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.toggleMute(); });
    expect(videoRef.current.muted).toBe(true);
  });

  test("flips video.muted from true to false", () => {
    const videoRef = makeVideoRef({ muted: true });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.toggleMute(); });
    expect(videoRef.current.muted).toBe(false);
  });

  test("muted state updates when the video fires volumechange event", () => {
    const videoRef = makeVideoRef({ muted: false });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => {
      videoRef.current.muted = true;
      videoRef.current._emit("volumechange");
    });
    expect(result.current.muted).toBe(true);
  });
});

describe("usePlaybackControls — seek", () => {
  test("seek(0) resets currentTime to the beginning", () => {
    const videoRef = makeVideoRef({ currentTime: 500 });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.seek(0); });
    expect(videoRef.current.currentTime).toBe(0);
  });

  test("seek(15) advances currentTime by 15 seconds", () => {
    const videoRef = makeVideoRef({ currentTime: 100 });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.seek(15); });
    expect(videoRef.current.currentTime).toBe(115);
  });

  test("seek(-15) rewinds currentTime by 15 seconds", () => {
    const videoRef = makeVideoRef({ currentTime: 100 });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.seek(-15); });
    expect(videoRef.current.currentTime).toBe(85);
  });

  test("seek(-15) clamps at 0 when near the start", () => {
    const videoRef = makeVideoRef({ currentTime: 5 });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.seek(-15); });
    expect(videoRef.current.currentTime).toBe(0);
  });

  test("seek(30) clamps at duration when near the end", () => {
    const videoRef = makeVideoRef({ currentTime: 3590 });
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.seek(30); });
    expect(videoRef.current.currentTime).toBe(3600);
  });
});

describe("usePlaybackControls — changeSpeed", () => {
  test("sets playbackRate on the video element", () => {
    const videoRef = makeVideoRef();
    const { result } = renderHook(() =>
      usePlaybackControls(videoRef, makeHlsRef(), 3600)
    );

    act(() => { result.current.changeSpeed(1.5); });
    expect(videoRef.current.playbackRate).toBe(1.5);
  });

  test("updates playbackSpeed state", () => {
    const { result } = renderHook(() =>
      usePlaybackControls(makeVideoRef(), makeHlsRef(), 3600)
    );

    act(() => { result.current.changeSpeed(2.0); });
    expect(result.current.playbackSpeed).toBe(2.0);
  });
});

describe("usePlaybackControls — changeQuality", () => {
  test("changeQuality(-1) enables ABR and updates selectedLevelIndex", () => {
    const hlsRef = makeHlsRef();
    const { result } = renderHook(() =>
      usePlaybackControls(makeVideoRef(), hlsRef, 3600)
    );

    act(() => { result.current.changeQuality(-1); });
    expect(hlsRef.current.currentLevel).toBe(-1);
    expect(result.current.selectedLevelIndex).toBe(-1);
  });

  test("changeQuality(2) locks to level 2", () => {
    const hlsRef = makeHlsRef();
    const { result } = renderHook(() =>
      usePlaybackControls(makeVideoRef(), hlsRef, 3600)
    );

    act(() => { result.current.changeQuality(2); });
    expect(hlsRef.current.loadLevel).toBe(2);
    expect(result.current.selectedLevelIndex).toBe(2);
  });
});

describe("usePlaybackControls — toggleAutoPlayNext", () => {
  beforeEach(() => localStorage.clear());

  test("default is true when localStorage has no value", () => {
    const { result } = renderHook(() =>
      usePlaybackControls(makeVideoRef(), makeHlsRef(), 3600)
    );
    expect(result.current.autoPlayNext).toBe(true);
  });

  test("toggleAutoPlayNext flips the state", () => {
    const { result } = renderHook(() =>
      usePlaybackControls(makeVideoRef(), makeHlsRef(), 3600)
    );

    act(() => { result.current.toggleAutoPlayNext(); });
    expect(result.current.autoPlayNext).toBe(false);
  });

  test("persists the toggled value to localStorage", () => {
    const { result } = renderHook(() =>
      usePlaybackControls(makeVideoRef(), makeHlsRef(), 3600)
    );

    act(() => { result.current.toggleAutoPlayNext(); });
    expect(localStorage.getItem("autoPlayNext")).toBe("false");
  });

  test("reads initial value from localStorage", () => {
    localStorage.setItem("autoPlayNext", "false");
    const { result } = renderHook(() =>
      usePlaybackControls(makeVideoRef(), makeHlsRef(), 3600)
    );
    expect(result.current.autoPlayNext).toBe(false);
  });
});
