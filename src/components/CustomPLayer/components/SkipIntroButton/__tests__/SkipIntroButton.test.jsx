import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SkipIntroButton from "../SkipIntroButton";

jest.mock("@noriginmedia/norigin-spatial-navigation", () => ({
  useFocusable: () => ({ ref: { current: null }, focused: false }),
  setFocus: jest.fn(),
}));

describe("SkipIntroButton", () => {
  test("renders the skip intro label", () => {
    render(<SkipIntroButton onSkip={jest.fn()} />);
    expect(screen.getByText("رد کردن تیتراژ")).toBeInTheDocument();
  });

  test("calls onSkip when clicked", () => {
    const onSkip = jest.fn();
    render(<SkipIntroButton onSkip={onSkip} />);

    fireEvent.click(screen.getByText("رد کردن تیتراژ"));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  test("applies focused class when focused", () => {
    jest.resetModules();
    jest.mock("@noriginmedia/norigin-spatial-navigation", () => ({
      useFocusable: () => ({ ref: { current: null }, focused: true }),
      setFocus: jest.fn(),
    }));

    // Re-import after remocking
    const FocusedSkipIntroButton = require("../SkipIntroButton").default;
    const { container } = render(<FocusedSkipIntroButton onSkip={jest.fn()} />);
    expect(container.firstChild).toHaveClass("skip-intro-btn-focused");
  });

  test("does not apply focused class when not focused", () => {
    const { container } = render(<SkipIntroButton onSkip={jest.fn()} />);
    expect(container.firstChild).not.toHaveClass("skip-intro-btn-focused");
    expect(container.firstChild).toHaveClass("skip-intro-btn");
  });
});
