import React from "react";
import { Focusable } from "react-js-spatial-navigation";

const NetworkError = ({
  errorText = "مشکلی به وجود آمده است لطفا از اتصال اینترنت خود مطمئا شوید",
}) => {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
      className="main"
    >
      <div display="flex" justifyContent="center">
        <p>{errorText}</p>
        <Focusable
          className="btn-reload"
          onClickEnter={() => {
            window.location.reload(false);
          }}
        >
          بازنشانی
        </Focusable>
      </div>
    </main>
  );
};

export default NetworkError;
