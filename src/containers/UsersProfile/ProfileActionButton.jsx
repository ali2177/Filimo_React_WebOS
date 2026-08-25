import React from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

/**
 * One of the two actions under the profile row ("حساب کاربری" / "خروج").
 *
 * `ghost` renders the sign-out variant, which has no background until focused.
 */
const ProfileActionButton = ({
  label,
  icon,
  focusKey,
  ghost,
  onEnterPress,
}) => {
  const { ref, focused } = useFocusable({ focusKey, onEnterPress });

  const className = [
    "profiles-action-btn",
    "u700",
    ghost && "profiles-action-btn-ghost",
    focused && "profiles-action-btn-focus",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      onMouseEnter={() => setFocus(focusKey)}
      onClick={onEnterPress}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default ProfileActionButton;
