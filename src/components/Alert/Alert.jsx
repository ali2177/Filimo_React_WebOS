import React from "react";
import AlertBtn from "./AlertBtn";
const Alert = ({ type, handleBtnEnter }) => {
  return (
    <div class="infoo alert">
      <div class="alert-content">
        <div>
          {type === "خرید بلیت و تماشا" ? (
            <p className="u700">
              بلیت اکران آنلاین را فقط می‌توانید از وبسایت تلویکا بخرید.
            </p>
          ) : (
            <p className="u700">برای خرید به سایت یا اپ فیلیمو مراجعه کنید</p>
          )}
        </div>

        <AlertBtn onEnterPress={handleBtnEnter} />
      </div>
    </div>
  );
};

export default Alert;
