import React, { useRef, useEffect, useState } from "react";
import line from "../../assets/images/line.svg";
import phone from "../../assets/images/phone.svg";
import { Focusable } from "react-js-spatial-navigation";
import { useGetLoginCodeQuery } from "../../services/TMDB";
import link from "../../assets/images/link.svg";
import linkLogin from "../../assets/images/linkLogin.svg";
import Code from "../Code/Code";
import { useNavigate, useLocation } from "react-router-dom";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import { useAuth } from "../AuthProvider";
import { useOnlineStatus } from "../App";
const Loogin = () => {
  const { jwt, setJwt } = useAuth();
  const { isOnline } = useOnlineStatus();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [userData, setUserData] = useState();
  const [code, setCode] = useState("");
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  //call for generating log in code
  // let jwt;
  let dataSet;

  let intervalCall;

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
  useEffect(() => {
    if (jwt && userData) {
      clearInterval(intervalCall);
      localStorage.setItem("jwt", userData.jwt);
      localStorage.setItem("display_name", userData.display_name);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("mobile_number", userData.mobile_number);
      localStorage.setItem("name", userData.name);
      localStorage.setItem("username", userData.username);
      localStorage.removeItem("lastdataloaded");
      if (location.pathname !== "/player") navigate(-1);
    }
  }, [jwt, userData]);

  //recive user data and check if log in
  const getData = async () => {
    try {
      const userAgent = {
        os: "WebOs",
        an: "Filimo",
        vn: "1.00",
      };
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/user/Authenticate/sync_account_verify/code/${code}/ref_type/tv`,
        {
          headers: {
            UserAgent: JSON.stringify(userAgent),
          },
        }
      );
      const blocks = await res?.json();
      if (blocks.data.attributes.jwt) {
        setUserData(blocks.data.attributes);
        setJwt(blocks.data.attributes.jwt);
        clearInterval(intervalCall);
      }
      // jwt = blocks.data.attributes.jwt;
      // console.log(blocks);
      // dataSet = blocks.data.attributes;
    } catch (e) {
      setError(e);
      console.log(e);
    }
  };
  //recive login code
  const getLoginCode = async () => {
    try {
      setIsLoading(true);
      const userAgent = {
        os: "WebOs",
        an: "Filimo",
        vn: "1.00",
      };
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/user/Authenticate/get_verify_code?ref_type=tv&devicetype=react_tizen      `,
        {
          headers: {
            UserAgent: JSON.stringify(userAgent),
          },
        }
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
    intervalCall = setInterval(() => {
      getData();
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
    if (key.keyCode === 10009 || key.keyCode === 8 || key.keyCode === 461) {
      if (location.pathname !== "/player") navigate(-1);
    }
  };

  if (isLoading) return <Loader />;

  if (error) return <NetworkError errorText="مشکلی پیش آمده است !" />;

  if (!code) return <NetworkError errorText="مشکلی پیش آمده است !" />;

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
                <span className="u500">filimo.com/activate</span>
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
