import { toFarsiDigits } from "../toFarsiDigits";

describe("toFarsiDigits", () => {
  test("converts all ten digits", () => {
    expect(toFarsiDigits("1234567890")).toBe("۱۲۳۴۵۶۷۸۹۰");
  });

  test("leaves non-digit characters untouched", () => {
    expect(toFarsiDigits("01:23")).toBe("۰۱:۲۳");
  });

  test("accepts a number as input", () => {
    expect(toFarsiDigits(42)).toBe("۴۲");
  });

  test("handles an empty string", () => {
    expect(toFarsiDigits("")).toBe("");
  });

  test("handles a string with no digits", () => {
    expect(toFarsiDigits("abc")).toBe("abc");
  });

  test("converts a formatted time string", () => {
    expect(toFarsiDigits("01:30:05")).toBe("۰۱:۳۰:۰۵");
  });
});
