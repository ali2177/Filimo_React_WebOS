import { renderHook, act } from "@testing-library/react";
import { useNextEpisode } from "../useNextEpisode";

const castData = { nextPartUid: "ep456", start: 200 };

describe("useNextEpisode", () => {
  test("showNextEpisode is false initially", () => {
    const { result } = renderHook(() => useNextEpisode(0, castData));
    expect(result.current.showNextEpisode).toBe(false);
  });

  test("showNextEpisode becomes true when currentTime reaches castData.start", () => {
    const { result, rerender } = renderHook(
      ({ time }) => useNextEpisode(time, castData),
      { initialProps: { time: 0 } }
    );

    act(() => { rerender({ time: 200 }); });
    expect(result.current.showNextEpisode).toBe(true);
  });

  test("showNextEpisode becomes true past castData.start", () => {
    const { result, rerender } = renderHook(
      ({ time }) => useNextEpisode(time, castData),
      { initialProps: { time: 0 } }
    );

    act(() => { rerender({ time: 250 }); });
    expect(result.current.showNextEpisode).toBe(true);
  });

  test("dismissNextEpisode hides the button", () => {
    const { result, rerender } = renderHook(
      ({ time }) => useNextEpisode(time, castData),
      { initialProps: { time: 200 } }
    );

    act(() => { result.current.dismissNextEpisode(); });
    expect(result.current.showNextEpisode).toBe(false);
  });

  test("button does not reappear after dismiss", () => {
    const { result, rerender } = renderHook(
      ({ time }) => useNextEpisode(time, castData),
      { initialProps: { time: 200 } }
    );

    act(() => { result.current.dismissNextEpisode(); });
    act(() => { rerender({ time: 201 }); });
    expect(result.current.showNextEpisode).toBe(false);
  });

  test("does nothing if castData has no nextPartUid", () => {
    const { result, rerender } = renderHook(
      ({ time }) => useNextEpisode(time, { start: 200 }),
      { initialProps: { time: 0 } }
    );

    act(() => { rerender({ time: 200 }); });
    expect(result.current.showNextEpisode).toBe(false);
  });

  test("does nothing if castData has no start", () => {
    const { result, rerender } = renderHook(
      ({ time }) => useNextEpisode(time, { nextPartUid: "ep456" }),
      { initialProps: { time: 0 } }
    );

    act(() => { rerender({ time: 200 }); });
    expect(result.current.showNextEpisode).toBe(false);
  });

  test("does nothing if castData is undefined", () => {
    const { result, rerender } = renderHook(
      ({ time }) => useNextEpisode(time, undefined),
      { initialProps: { time: 0 } }
    );

    act(() => { rerender({ time: 200 }); });
    expect(result.current.showNextEpisode).toBe(false);
  });
});
