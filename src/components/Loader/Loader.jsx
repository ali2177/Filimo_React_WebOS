import React from "react";

const Loader = () => {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="main info"
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="loader"></div>
      </div>
    </main>
  );
};

export default Loader;
