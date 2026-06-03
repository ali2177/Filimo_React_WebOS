import React, { useEffect, useLayoutEffect, useRef } from "react";

export default function FakeInput({
  value,
  caret, // 0..value.length
  onSetCaret,
  placeholder = "Type here…",
  fontFamily = `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Vazirmatn", sans-serif`,
}) {
  const boxRef = useRef(null);
  const textRef = useRef(null);
  const caretRef = useRef(null);

  // position the caret overlay at the given index without breaking the text run
  const positionCaret = () => {
    if (!boxRef.current || !textRef.current || !caretRef.current) return;
    if (!value.length) {
      caretRef.current.style.display = "none";
      return;
    }

    caretRef.current.style.display = "block";

    // create a DOM Range within the text node
    const textNode = textRef.current.firstChild; // the Text node
    if (!textNode || textNode.nodeType !== 3) return;

    const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
    const index = clamp(caret, 0, value.length);

    const range = document.createRange();
    range.setStart(textNode, index);
    range.collapse(true);

    // measure range position and place caret
    const r = range.getClientRects()[0] || range.getBoundingClientRect();
    const host = boxRef.current.getBoundingClientRect();

    // caret left/top inside the box
    const left = (r ? r.left : host.left) - host.left;
    const top = (r ? r.top : host.top) - host.top;

    caretRef.current.style.transform = `translate(${left}px, ${top}px)`;
    caretRef.current.style.height = `${r ? r.height : 20}px`;
  };

  useLayoutEffect(positionCaret, [value, caret]);

  // click → move caret to nearest character boundary (uses native APIs)
  const handleClick = (e) => {
    if (!value.length) return;

    // 1) modern
    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos && pos.offsetNode === textRef.current.firstChild) {
        onSetCaret(pos.offset);
        return;
      }
    }

    // 2) webkit legacy
    if (document.caretRangeFromPoint) {
      const rng = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (rng && rng.startContainer === textRef.current.firstChild) {
        onSetCaret(rng.startOffset);
        return;
      }
    }

    // 3) fallback: binary search by measuring ranges
    const textNode = textRef.current.firstChild;
    const rectBox = boxRef.current.getBoundingClientRect();
    let lo = 0,
      hi = value.length,
      best = 0,
      min = Infinity;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const r = document.createRange();
      r.setStart(textNode, mid);
      r.collapse(true);
      const rr = r.getClientRects()[0] || r.getBoundingClientRect();
      const x = rr.left - rectBox.left;
      const d = Math.abs(x - (e.clientX - rectBox.left));
      if (d < min) {
        min = d;
        best = mid;
      }
      if (x < e.clientX - rectBox.left) lo = mid + 1;
      else hi = mid - 1;
    }
    onSetCaret(best);
  };

  return (
    <div
      ref={boxRef}
      className="fake-input"
      role="textbox"
      aria-label="Text input"
      onClick={handleClick}
      style={{
        position: "relative",
        whiteSpace: "pre-wrap", // supports \n
        cursor: "text",
        overflow: "hidden",
      }}
    >
      {/* placeholder when empty */}
      {!value && <div className="placeholder u500">{placeholder}</div>}

      {/* single continuous text node -> preserves Farsi joining */}
      <div className="placeholder white-color u500" ref={textRef}>
        {value}
      </div>

      {/* absolutely-positioned blinking caret overlay */}
      <span
        ref={caretRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 2,
          background: "#00bfff",
          display: value ? "block" : "none",
          animation: "kb-blink 1s steps(1) infinite",
          pointerEvents: "none",
        }}
      />
      <style>{`
        @keyframes kb-blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
