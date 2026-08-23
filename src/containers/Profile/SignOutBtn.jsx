import React from "react";
import {
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useSignOut } from "@src/hooks/useSignOut";

const SignOutBtn = () => {
  const signOut = useSignOut();
  const { ref, focused, focusKey } = useFocusable({
    onEnterPress: signOut,
    focusable: true,
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: false,
    preferredChildFocusKey: null,
  });

  return (
    <div
      ref={ref}
      className={focused ? "btn-back u700 btn-back-focus" : "btn-back u700"}
      onMouseEnter={() => {
        setFocus(focusKey);
      }}
      onClick={signOut}
    >
      خروج از حساب کاربری
    </div>
  );
};

export default SignOutBtn;
