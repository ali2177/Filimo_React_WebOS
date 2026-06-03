import React from "react";
import AlertBtn from "./AlertBtn";
const Alert = ({ type, handleBtnEnter }) => {
  if (type === "error_player") {
    return (
      <div className="infoo alert-network">
        <div className="alert-content">
          <div>
            {type === "error_player" && (
              <p className="u700">اتصال اینترنت خود را بررسی کنید.</p>
            )}
          </div>
          {/* <AlertBtn onEnterPress={handleBtnEnter} /> */}
        </div>
      </div>
    );
  } else {
    return (
      <div class="infoo alert">
        <div class="alert-content">
          <div>
            {type === "error" && (
              <p className="u700">مشکلی در بارگزاری فیلم به وجود آمده است .</p>
            )}
            {type === "movie_rent" && (
              <p className="u700">
                بلیت اکران آنلاین را فقط می‌توانید از وبسایت فیلمو بخرید.
              </p>
            )}
            {type === "pay" && (
              <p className="u700">
                برای خرید اشتراک یا تهیه بلیت به وبسایت فیلمو مراجعه کنید
              </p>
            )}
          </div>

          <AlertBtn onEnterPress={handleBtnEnter} />
        </div>
      </div>
    );
  }
};

export default Alert;
