import React, { useEffect, useRef } from "react";

import { useNavigate, Link, useNavigation } from "react-router-dom";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";

const SeasonBtn = ({ ui_id, onFocus, onEnterPress, seriesName }) => {
  const { ref, focused, focusSelf, focusKey } = useFocusable({
    onFocus,
    onEnterPress: () => {
      localStorage.setItem("seasonBtn", "season-btn");
      localStorage.setItem("seriesName", seriesName);
      localStorage.removeItem("lastSeasonFocus");
      localStorage.removeItem("lastSeasonFocus_parent_new");
      localStorage.removeItem("lastSeasonFocus_season_part");
      localStorage.removeItem("recommBtn");
      navigate(`/allepisodes/${ui_id}`);
    },
    focusKey: "season-btn",
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(focusKey);
  //   setFocus("paly-btn");
  //   // focusSelf();
  // }, [focusSelf]);
  // useEffect(() => {
  //   console.log(focusKey);
  //   focusSelf();
  // }, []);

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className={focused ? "btn-ctrl btn-play-focus u400" : "btn-ctrl u400"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23.3333 5.33329H8.66665C8.31302 5.33329 7.97389 5.19282 7.72384 4.94277C7.47379 4.69272 7.33331 4.35358 7.33331 3.99996C7.33331 3.64634 7.47379 3.3072 7.72384 3.05715C7.97389 2.8071 8.31302 2.66663 8.66665 2.66663H23.3333C23.6869 2.66663 24.0261 2.8071 24.2761 3.05715C24.5262 3.3072 24.6666 3.64634 24.6666 3.99996C24.6666 4.35358 24.5262 4.69272 24.2761 4.94277C24.0261 5.19282 23.6869 5.33329 23.3333 5.33329ZM24.6666 25.3333H7.33331C6.27245 25.3333 5.25503 24.9119 4.50489 24.1617C3.75474 23.4116 3.33331 22.3942 3.33331 21.3333V10.6666C3.33331 9.60576 3.75474 8.58834 4.50489 7.8382C5.25503 7.08805 6.27245 6.66663 7.33331 6.66663H24.6666C25.7275 6.66663 26.7449 7.08805 27.4951 7.8382C28.2452 8.58834 28.6666 9.60576 28.6666 10.6666V21.3333C28.6666 22.3942 28.2452 23.4116 27.4951 24.1617C26.7449 24.9119 25.7275 25.3333 24.6666 25.3333ZM6.3905 9.72382C6.14046 9.97387 5.99998 10.313 5.99998 10.6666V21.3333C5.99998 21.6869 6.14046 22.0261 6.3905 22.2761C6.64055 22.5262 6.97969 22.6666 7.33331 22.6666H24.6666C25.0203 22.6666 25.3594 22.5262 25.6095 22.2761C25.8595 22.0261 26 21.6869 26 21.3333V10.6666C26 10.313 25.8595 9.97387 25.6095 9.72382C25.3594 9.47377 25.0203 9.33329 24.6666 9.33329H7.33331C6.97969 9.33329 6.64055 9.47377 6.3905 9.72382ZM23.3333 29.3333C23.6869 29.3333 24.0261 29.1928 24.2761 28.9428C24.5262 28.6927 24.6666 28.3536 24.6666 28C24.6666 27.6463 24.5262 27.3072 24.2761 27.0571C24.0261 26.8071 23.6869 26.6666 23.3333 26.6666H8.66665C8.31302 26.6666 7.97389 26.8071 7.72384 27.0571C7.47379 27.3072 7.33331 27.6463 7.33331 28C7.33331 28.3536 7.47379 28.6927 7.72384 28.9428C7.97389 29.1928 8.31302 29.3333 8.66665 29.3333H23.3333ZM18.92 17.0533L14.6666 19.9066C14.465 20.0429 14.2299 20.1215 13.9869 20.1337C13.7438 20.1459 13.502 20.0914 13.2878 19.976C13.0735 19.8606 12.8949 19.6888 12.7713 19.4791C12.6477 19.2695 12.5838 19.03 12.5866 18.7866V13.1066C12.5863 12.8644 12.6519 12.6266 12.7765 12.4189C12.9011 12.2112 13.0799 12.0413 13.2937 11.9275C13.5075 11.8137 13.7483 11.7604 13.9902 11.7731C14.2321 11.7859 14.466 11.8643 14.6666 12L18.92 14.84C19.1015 14.9619 19.2502 15.1267 19.353 15.3196C19.4558 15.5126 19.5096 15.728 19.5096 15.9466C19.5096 16.1653 19.4558 16.3806 19.353 16.5736C19.2502 16.7666 19.1015 16.9313 18.92 17.0533Z"
            fill="white"
          />
        </svg>
        تمامی قسمت ها
      </div>
    </FocusContext.Provider>
  );
};

export default SeasonBtn;
