import { formatTime } from "../formatTime";

describe("formatTime", () => {
  test("returns 00:00 for 0", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  test("returns 00:00 for null", () => {
    expect(formatTime(null)).toBe("00:00");
  });

  test("returns 00:00 for NaN", () => {
    expect(formatTime(NaN)).toBe("00:00");
  });

  test("formats seconds under one minute", () => {
    expect(formatTime(45)).toBe("00:45");
  });

  test("formats minutes and seconds", () => {
    expect(formatTime(65)).toBe("01:05");
  });

  test("formats exactly one hour", () => {
    expect(formatTime(3600)).toBe("01:00:00");
  });

  test("formats hours, minutes, and seconds", () => {
    expect(formatTime(3723)).toBe("01:02:03");
  });

  test("zero-pads single-digit minutes and seconds", () => {
    expect(formatTime(61)).toBe("01:01");
  });

  test("formats large duration", () => {
    expect(formatTime(7384)).toBe("02:03:04");
  });
});
