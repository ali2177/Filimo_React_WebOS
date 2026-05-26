export const toFarsiDigits = (str) =>
  String(str).split("").map((c) => "۰۱۲۳۴۵۶۷۸۹"[c] ?? c).join("");
