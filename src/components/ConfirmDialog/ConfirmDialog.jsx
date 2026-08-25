import React, { useEffect } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useBackKey } from "@src/hooks/useBackKey";
import ConfirmDialogBtn from "./ConfirmDialogBtn";
import "./ConfirmDialog.css";

const CONFIRM_KEY = "confirm-dialog-yes";
const CANCEL_KEY = "confirm-dialog-no";

/**
 * Centered two-button confirmation dialog (Figma node 5380:388).
 *
 * Focus is trapped inside the dialog in all four directions, and lands on the
 * *cancel* button on open — that is what the design shows highlighted, and it
 * is the safe default when the confirm action is destructive.
 *
 * Callers should disable their own back-key handler while this is mounted
 * (`useBackKey(fn, { enabled: !open })`), since the dialog owns Back.
 */
const ConfirmDialog = ({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  const { ref, focusKey } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });

  useEffect(() => {
    // Deferred: the buttons register with the nav tree on their own mount, so
    // focusing synchronously here would target a key that does not exist yet.
    const id = setTimeout(() => setFocus(CANCEL_KEY), 10);
    return () => clearTimeout(id);
  }, []);

  useBackKey(onCancel);

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="confirm-dialog-overlay" />
      <div className="confirm-dialog-wrapper">
        <div ref={ref} className="confirm-dialog">
          <div className="confirm-dialog-content">
            <p className="confirm-dialog-title u500">{title}</p>
            <p className="confirm-dialog-message u500">{message}</p>
          </div>
          {/* Confirm first so that under dir="rtl" it renders on the right and
              cancel on the left, matching the design. */}
          <div className="confirm-dialog-actions">
            <ConfirmDialogBtn
              focusKey={CONFIRM_KEY}
              text={confirmText}
              onPress={onConfirm}
            />
            <ConfirmDialogBtn
              focusKey={CANCEL_KEY}
              text={cancelText}
              onPress={onCancel}
            />
          </div>
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default ConfirmDialog;
