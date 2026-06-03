import React from "react";

const Code = ({ code }) => {
  const codeAray = code.split("").reverse();

  return (
    <div style={{ display: "flex" }}>
      {codeAray.map((item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "3.6rem",
            height: "3.3rem",
            background: "rgba(255, 255, 255, 0.12)",
            borderRadius: "0.6rem",
            fontSize: "2rem",
            fontWeight: "500",
            marginLeft: "1.1rem",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Code;
