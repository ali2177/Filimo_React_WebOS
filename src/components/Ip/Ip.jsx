import React, { useState, useEffect } from "react";

const Ip = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  const getLoginCode = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`https://api.ipify.org?format=json`);
      const blocks = await res?.json();
      setData(blocks);
      console.log(blocks);
      setIsLoading(false);
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };

  useEffect(() => {
    getLoginCode();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
        width: "100%",
      }}
    >
      <div>
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "24px",
          }}
        >
          Your IP
        </div>
        <span
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "24px",
          }}
        >
          {data && data.ip}
        </span>
      </div>
    </div>
  );
};

export default Ip;
