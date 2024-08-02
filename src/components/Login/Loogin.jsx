import React, { useRef, useEffect, useState } from "react";
import line from "../../assets/images/line.svg";
import phone from "../../assets/images/phone.svg";
import { Focusable } from "react-js-spatial-navigation";
import { useGetLoginCodeQuery } from "../../services/TMDB";
import link from "../../assets/images/link.svg";
import linkLogin from "../../assets/images/linkLogin.svg";
import Code from "../Code/Code";
import { useNavigate } from "react-router-dom";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
const Loogin = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [code, setCode] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  //call for generating log in code
  let jwt;
  let dataSet;

  //clear local storage
  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    getLoginCode();
    localStorage.removeItem("jwt");
    localStorage.removeItem("display_name");
    localStorage.removeItem("email");
    localStorage.removeItem("mobile_number");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  //recive user data and check if log in
  const getData = async () => {
    try {
      const res = await fetch(
        `https://www.televika.com/api/fa/v1/user/Authenticate/sync_account_verify/code/${code}/ref_type/tv`
      );
      const blocks = await res?.json();
      jwt = blocks.data.attributes.jwt;
      dataSet = blocks.data.attributes;
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };
  //recive login code
  const getLoginCode = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://www.televika.com/api/fa/v1/user/Authenticate/get_verify_code?ref_type=tv`
      );
      const blocks = await res?.json();
      setData(blocks);
      setCode(blocks.data.attributes.code);
      setIsLoading(false);
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };

  //start timer when code is generated and wait for user to login
  useEffect(() => {
    const intervalCall = setInterval(() => {
      getData();
      if (jwt) {
        clearInterval(intervalCall);
        localStorage.setItem("jwt", dataSet.jwt);
        localStorage.setItem("display_name", dataSet.display_name);
        localStorage.setItem("email", dataSet.email);
        localStorage.setItem("mobile_number", dataSet.mobile_number);
        localStorage.setItem("name", dataSet.name);
        localStorage.setItem("username", dataSet.username);
        navigate("/");
      }
    }, 1000);
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, [code]);

  // on blur input when press inter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      ref.current.blur();
    }
  };
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      navigate(-1);
    }
  };

  if (error) return <NetworkError />;

  if (isLoading) return <Loader />;

  if (!code) return <NetworkError />;

  return (
    <div className="login-content">
      <div className="more-section-header">
        <h1 className="u700">{data.data.attributes.page_text.pageTitle}</h1>
        {/* <Focusable
          className="btn-back"
          onClickEnter={() => {
            navigate(-1);
          }}
        >
          <p>بازگشت</p>
        </Focusable> */}
      </div>
      <div className="login-body">
        <div className="login-body-right">
          <div className="login-body-right-head">
            <div className="login-body-right-title">
              <p className="u700">
                {data.data.attributes.page_text.qrSection.title}
              </p>
            </div>

            <p className="u500">
              {data.data.attributes.page_text.qrSection.description}
            </p>
          </div>
          <div className="login-body-right-body">
            <img className="qr-code" src={data.data.attributes.qrURL} />
            <img className="line" src={line} />
            <p className="u500">
              {data.data.attributes.page_text.qrSection.linkTitle}
            </p>
            <span className="u500">
              {data.data.attributes.page_text.qrSection.linkDescription}
            </span>
            <Focusable>
              <div className="link-login">
                <span className="u500">televika.com/activate</span>
                <img src={linkLogin} />
              </div>
            </Focusable>
            <Focusable>
              <Code code={code} />
            </Focusable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loogin;
