import { renderHook, act } from "@testing-library/react";
import { useSkipIntro } from "../useSkipIntro";

const makeVideoRef = () => ({
  current: {
    currentTime: 0,
    paused: true,
    play: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn((event, cb) => {
      // Immediately fire "seeked" so skipIntro resolves synchronously in tests
      if (event === "seeked") cb();
    }),
    removeEventListener: jest.fn(),
  },
});

describe("useSkipIntro", () => {
  test("showSkipIntro is false initially", () => {
    const { result } = renderHook(() =>
      useSkipIntro(0, 60, 180, makeVideoRef())
    );
    expect(result.current.showSkipIntro).toBe(false);
  });

  test("showSkipIntro becomes true when currentTime enters intro range", () => {
    const videoRef = makeVideoRef();
    const { result, rerender } = renderHook(
      ({ time }) => useSkipIntro(time, 60, 180, videoRef),
      { initialProps: { time: 0 } }
    );

    act(() => { rerender({ time: 90 }); });
    expect(result.current.showSkipIntro).toBe(true);
  });

  test("showSkipIntro becomes false when currentTime exits intro range", () => {
    const videoRef = makeVideoRef();
    const { result, rerender } = renderHook(
      ({ time }) => useSkipIntro(time, 60, 180, videoRef),
      { initialProps: { time: 90 } }
    );

    act(() => { rerender({ time: 200 }); });
    expect(result.current.showSkipIntro).toBe(false);
  });

  test("showSkipIntro is true at the exact introStart boundary", () => {
    const videoRef = makeVideoRef();
    const { result, rerender } = renderHook(
      ({ time }) => useSkipIntro(time, 60, 180, videoRef),
      { initialProps: { time: 0 } }
    );

    act(() => { rerender({ time: 60 }); });
    expect(result.current.showSkipIntro).toBe(true);
  });

  test("showSkipIntro is false when introStart or introEnd are not provided", () => {
    const videoRef = makeVideoRef();
    const { result, rerender } = renderHook(
      ({ time }) => useSkipIntro(time, null, null, videoRef),
      { initialProps: { time: 0 } }
    );

    act(() => { rerender({ time: 90 }); });
    expect(result.current.showSkipIntro).toBe(false);
  });

  test("skipIntro seeks video to introEnd and hides the button", () => {
    const videoRef = makeVideoRef();
    const { result } = renderHook(() =>
      useSkipIntro(90, 60, 180, videoRef)
    );

    act(() => { result.current.skipIntro(); });

    expect(videoRef.current.currentTime).toBe(180);
    expect(result.current.showSkipIntro).toBe(false);
  });

  test("skipIntroRef stays in sync with showSkipIntro", () => {
    const videoRef = makeVideoRef();
    const { result, rerender } = renderHook(
      ({ time }) => useSkipIntro(time, 60, 180, videoRef),
      { initialProps: { time: 0 } }
    );

    expect(result.current.skipIntroRef.current).toBe(false);

    act(() => { rerender({ time: 90 }); });
    expect(result.current.skipIntroRef.current).toBe(true);

    act(() => { rerender({ time: 200 }); });
    expect(result.current.skipIntroRef.current).toBe(false);
  });
});
