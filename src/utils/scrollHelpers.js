// Manual scroll helpers for the content rows. We compute the target scroll
// position ourselves (instead of Element.scrollIntoView) so we control exactly
// how the focused card is aligned. All math is done in screen-pixel deltas via
// getBoundingClientRect, which makes it direction-agnostic — it behaves the
// same in the app's RTL layout as it would in LTR.

// Nearest scrollable ancestor on the given axis ("x" | "y").
function getScrollParent(node, axis) {
  let el = node?.parentElement;
  while (el) {
    const style = window.getComputedStyle(el);
    const overflow = axis === "x" ? style.overflowX : style.overflowY;
    if (/(auto|scroll)/.test(overflow)) {
      const scrollable =
        axis === "x"
          ? el.scrollWidth > el.clientWidth
          : el.scrollHeight > el.clientHeight;
      if (scrollable) return el;
    }
    el = el.parentElement;
  }
  return null;
}

// Center `el` horizontally within its nearest horizontal scroll container.
export function centerHorizontally(el) {
  if (!el) return;
  const container = getScrollParent(el, "x");
  if (!container) return;
  const elRect = el.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  const delta =
    elRect.left + elRect.width / 2 - (cRect.left + cRect.width / 2);
  // scrollTo clamps to the valid range, so edge cards land as close to center
  // as their remaining scroll room allows.
  container.scrollTo({ left: container.scrollLeft + delta });
}

// Scroll `el` into view vertically within its nearest vertical scroll
// container. align: "center" keeps it mid-viewport; "end" aligns its bottom to
// the container bottom (used for the first row so it doesn't jump under the hero).
export function scrollVertically(el, align = "center") {
  if (!el) return;
  const container = getScrollParent(el, "y");
  if (!container) return;
  const elRect = el.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  const delta =
    align === "end"
      ? elRect.bottom - cRect.bottom
      : elRect.top + elRect.height / 2 - (cRect.top + cRect.height / 2);
  container.scrollTo({ top: container.scrollTop + delta });
}
