import React from "react";

const Code = ({ code }) => {
  const codeAray = code.split("").reverse();

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      {codeAray.map((item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "70px",
            height: "65.33px",
            background: "rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            fontSize: "40px",
            fontWeight: "500",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Code;
