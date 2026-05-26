import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NextEpisodeButton from "../NextEpisodeButton";

jest.mock("@noriginmedia/norigin-spatial-navigation", () => ({
  useFocusable: () => ({ ref: { current: null }, focused: false }),
  setFocus: jest.fn(),
}));

const castData = { nextPartUid: "ep456", start: 200 };

describe("NextEpisodeButton", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders the next episode label", () => {
    render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={false}
        onNextEpisode={jest.fn()}
        onDismiss={jest.fn()}
      />
    );
    expect(screen.getByText("تماشای قسمت بعد")).toBeInTheDocument();
  });

  test("renders the dismiss button", () => {
    render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={false}
        onNextEpisode={jest.fn()}
        onDismiss={jest.fn()}
      />
    );
    expect(screen.getByText("✕")).toBeInTheDocument();
  });

  test("calls onNextEpisode with nextPartUid when the button is clicked", () => {
    const onNextEpisode = jest.fn();
    render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={false}
        onNextEpisode={onNextEpisode}
        onDismiss={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("تماشای قسمت بعد"));
    expect(onNextEpisode).toHaveBeenCalledWith("ep456");
  });

  test("calls onDismiss when the dismiss button is clicked", () => {
    const onDismiss = jest.fn();
    render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={false}
        onNextEpisode={jest.fn()}
        onDismiss={onDismiss}
      />
    );

    fireEvent.click(screen.getByText("✕"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test("auto-navigates after 10 seconds when autoPlayNext is true", () => {
    const onNextEpisode = jest.fn();
    render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={true}
        onNextEpisode={onNextEpisode}
        onDismiss={jest.fn()}
      />
    );

    jest.advanceTimersByTime(10000);
    expect(onNextEpisode).toHaveBeenCalledWith("ep456");
  });

  test("does not auto-navigate before 10 seconds", () => {
    const onNextEpisode = jest.fn();
    render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={true}
        onNextEpisode={onNextEpisode}
        onDismiss={jest.fn()}
      />
    );

    jest.advanceTimersByTime(9999);
    expect(onNextEpisode).not.toHaveBeenCalled();
  });

  test("does not auto-navigate when autoPlayNext is false", () => {
    const onNextEpisode = jest.fn();
    render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={false}
        onNextEpisode={onNextEpisode}
        onDismiss={jest.fn()}
      />
    );

    jest.advanceTimersByTime(10000);
    expect(onNextEpisode).not.toHaveBeenCalled();
  });

  test("shows fill animation element when autoPlayNext is true", () => {
    const { container } = render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={true}
        onNextEpisode={jest.fn()}
        onDismiss={jest.fn()}
      />
    );
    expect(container.querySelector(".next-episode-fill")).toBeInTheDocument();
  });

  test("does not render fill animation when autoPlayNext is false", () => {
    const { container } = render(
      <NextEpisodeButton
        castData={castData}
        autoPlayNext={false}
        onNextEpisode={jest.fn()}
        onDismiss={jest.fn()}
      />
    );
    expect(container.querySelector(".next-episode-fill")).not.toBeInTheDocument();
  });
});
