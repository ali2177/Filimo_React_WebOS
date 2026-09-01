import React, { useEffect } from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useLocation } from "react-router-dom";
import { uiStorage } from "@src/utils/uiStorage";
import { getSelectedProfile } from "@src/utils/profileSession";
import { useReportNavFocus } from "../Navbar/NavFocusContext";

// One focusable menu row. `variant="profile"` renders the head block (ringed
// avatar + two lines) that sits above the list when signed in; everything else
// renders the icon/label row. Focused and active look identical by design —
// the orange dot under the icon is the only active-only marker.
const SidebarItem = ({
  data,
  handleEnterPress,
  focuskeey,
  isActive,
  variant,
}) => {
  const { pathname } = useLocation();
  const { ref, focused, focusKey } = useFocusable({
    focusKey: focuskeey,
    onEnterPress: () => {
      handleEnterPress(focusKey);
    },
    onArrowPress: (e) => {
      if (e === "left") {
        setTimeout(() => {
          if (uiStorage.getItem("lastMovieFocus"))
            setFocus(uiStorage.getItem("lastMovieFocus"));
        }, 100);
      }
    },
  });

  // Tell the navbar whether this row holds focus. `focused` is pushed straight
  // to the row, so it stays correct even when the nav's own `hasFocusedChild`
  // doesn't arrive — see components/Navbar/NavFocusContext.js.
  const reportNavFocus = useReportNavFocus();
  useEffect(() => {
    reportNavFocus(focusKey, focused);
    return () => reportNavFocus(focusKey, false);
  }, [reportNavFocus, focusKey, focused]);

  // Landing on home makes the home row the one focus returns to. The row knows
  // its own focus key, so there's no need to re-derive it from the menu list.
  useEffect(() => {
    if (pathname === "/" && data.link_key === "1") {
      uiStorage.setItem("lastFocusMenuItem", focuskeey);
    }
  }, [pathname, focuskeey, data.link_key]);

  const highlighted = focused || isActive;

  if (variant === "profile") {
    // Figma shows the *profile's* name on top and the API's label below it. The
    // name is only known once a profile has been picked, so fall back to the
    // API's own label/sub_text pair when it hasn't.
    const profile = getSelectedProfile();
    const name = profile?.name || data.link_text;
    const sub = profile?.name ? data.link_text : data.link_extra?.sub_text?.text;
    const avatar = profile?.avatar || data.link_icon;
    const ringColor = data.link_extra?.border?.color;

    return (
      <div
        ref={ref}
        className={
          highlighted ? "nav-profile nav-profile--active" : "nav-profile"
        }
        onMouseEnter={() => {
          setFocus(focusKey);
        }}
        onClick={() => {
          handleEnterPress(focusKey);
        }}
      >
        <span
          className="nav-profile-ring"
          style={ringColor ? { borderColor: ringColor } : undefined}
        >
          {avatar ? (
            <img className="nav-profile-avatar" src={avatar} alt="" />
          ) : (
            <span className="nav-profile-avatar nav-profile-fallback u700">
              {name.slice(0, 1)}
            </span>
          )}
        </span>
        <span className="nav-profile-labels">
          <span className="nav-profile-name u500">{name}</span>
          {sub && <span className="nav-profile-sub u400">{sub}</span>}
        </span>
      </div>
    );
  }

  // link_extra.sub_text drives the second line — today only the subscribe row
  // uses it ("اشتراک ندارید" in the API-supplied red).
  const subText = data.link_extra?.sub_text;

  return (
    <div
      ref={ref}
      className={highlighted ? "menu-item menu-item--active" : "menu-item"}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={() => {
        handleEnterPress(focusKey);
      }}
    >
      <span className="menu-item-icon-wrap">
        <img
          className="menu-item-icon"
          src={highlighted ? data.link_icon_h : data.link_icon}
          alt=""
        />
        {isActive && <span className="menu-active-dot" />}
      </span>
      <span className="menu-item-labels">
        <span
          className={
            highlighted ? "menu-item-label u700" : "menu-item-label u500"
          }
        >
          {data.link_text}
        </span>
        {subText?.text && (
          <span
            className="menu-item-sub u400"
            style={subText.color ? { color: subText.color } : undefined}
          >
            {subText.text}
          </span>
        )}
      </span>
    </div>
  );
};

export default React.memo(SidebarItem);
