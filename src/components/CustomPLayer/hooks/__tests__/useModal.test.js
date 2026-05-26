import { renderHook, act } from "@testing-library/react";
import { useModal } from "../useModal";

const makeVideoRef = ({ paused = true } = {}) => ({
  current: {
    paused,
    pause: jest.fn(),
    play: jest.fn().mockResolvedValue(undefined),
  },
});

describe("useModal", () => {
  test("activeModal is null initially", () => {
    const { result } = renderHook(() => useModal(makeVideoRef()));
    expect(result.current.activeModal).toBeNull();
  });

  test("openModal sets activeModal to the given type", () => {
    const { result } = renderHook(() => useModal(makeVideoRef()));

    act(() => { result.current.openModal("subtitle"); });
    expect(result.current.activeModal).toBe("subtitle");
  });

  test("openModal pauses a playing video", () => {
    const videoRef = makeVideoRef({ paused: false });
    const { result } = renderHook(() => useModal(videoRef));

    act(() => { result.current.openModal("settings"); });
    expect(videoRef.current.pause).toHaveBeenCalledTimes(1);
  });

  test("openModal does not pause an already-paused video", () => {
    const videoRef = makeVideoRef({ paused: true });
    const { result } = renderHook(() => useModal(videoRef));

    act(() => { result.current.openModal("settings"); });
    expect(videoRef.current.pause).not.toHaveBeenCalled();
  });

  test("openModal can switch between modal types", () => {
    const { result } = renderHook(() => useModal(makeVideoRef()));

    act(() => { result.current.openModal("audio"); });
    expect(result.current.activeModal).toBe("audio");

    act(() => { result.current.openModal("episodes"); });
    expect(result.current.activeModal).toBe("episodes");
  });

  test("closeModal sets activeModal to null", () => {
    const { result } = renderHook(() => useModal(makeVideoRef()));

    act(() => { result.current.openModal("audio"); });
    act(() => { result.current.closeModal(); });
    expect(result.current.activeModal).toBeNull();
  });

  test("closeModal resumes playback if video was playing when modal opened", () => {
    const videoRef = makeVideoRef({ paused: false });
    const { result } = renderHook(() => useModal(videoRef));

    act(() => { result.current.openModal("subtitle"); });
    act(() => { result.current.closeModal(); });
    expect(videoRef.current.play).toHaveBeenCalledTimes(1);
  });

  test("closeModal does not resume if video was paused when modal opened", () => {
    const videoRef = makeVideoRef({ paused: true });
    const { result } = renderHook(() => useModal(videoRef));

    act(() => { result.current.openModal("subtitle"); });
    act(() => { result.current.closeModal(); });
    expect(videoRef.current.play).not.toHaveBeenCalled();
  });
});
