import React from "react";
import "./ExitModal.css";
import { Focusable } from "react-js-spatial-navigation";

const ExitModal = ({ show, onExit }) => {
  const exitButtonHandler = () => {
    onExit(false);
  };
  return (
    <>
      <div class={show ? "modalcontainer active" : "modalcontainer"}>
        <div class="flex">
          <div class={show ? "modal active" : "modal"}>
            <Focusable onClickEnter={exitButtonHandler} className={"close"}>
              <span>43</span>
            </Focusable>

            <div class="m-content u700">
              <p>آیا می خواهید از برنامه خارج شوید ؟</p>
            </div>
            <div class="buttons">
              <Focusable
                onClickEnter={() => {
                  window.tizen.application.getCurrentApplication().exit();
                }}
                className={"buttons-btn u700"}
              >
                بله
              </Focusable>
              <Focusable
                onClickEnter={exitButtonHandler}
                className={"buttons-btn u700"}
              >
                خیر
              </Focusable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExitModal;
