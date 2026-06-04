import React, { useEffect, useState, createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@src/components/index";
import Splash from "@src/components/Splash";
import "./App.css";
import {
  init,
} from "@noriginmedia/norigin-spatial-navigation";
import Alert from "@src/components/Alert/Alert";
import Loader from "@src/components/Loader/Loader";
import { useAuth } from "@src/components/AuthProvider";
import AppRoutes from "@src/app/routes";
import { useFilimioFetch } from "@src/hooks/useFilimioFetch";
import { usePolling } from "@src/hooks/usePolling";

init({
  debug: false,
  rtl: true,
});

// Create Context
const OnlineStatusContext = createContext();
export const useOnlineStatus = () => useContext(OnlineStatusContext);

function App() {
  const { jwt, setJwt } = useAuth();
  const filimioFetch = useFilimioFetch();

  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isKid, setIsKid] = useState(false);
  const [isSeasonChange, setIsSeasonChange] = useState(false);
  const location = useLocation("");
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isShowSplash, setIsShowSplash] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  //check when we are in movieinfo or player or login page and dont show the menu
  //check when we are in movieinfo or player or login page and dont show the menu
  useEffect(() => {
    // setJwt(localStorage.getItem("jwt"));
    // jwt = localStorage.getItem("jwt");
    if (jwt) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    // console.log(location.pathname.slice(0, 7));

    if (
      location.pathname.slice(0, 7) === "/movie/" ||
      location.pathname.slice(0, 7) === "/player" ||
      location.pathname.slice(0, 7) === "/search" ||
      location.pathname.slice(0, 7) === "/moremo" ||
      location.pathname.slice(0, 7) === "/catego" ||
      location.pathname.slice(0, 7) === "/morere" ||
      location.pathname.slice(0, 7) === "/moreca" ||
      location.pathname.slice(0, 7) === "/actor/" ||
      location.pathname.slice(0, 7) === "/allepi" ||
      location.pathname.slice(0, 7) === "/moreSi" ||
      location.pathname.slice(0, 7) === "/profil" ||
      location.pathname.slice(0, 7) === "/ipchec" ||
      location.pathname.slice(0, 7) === "/usersP" ||
      location.pathname.slice(0, 7) === "/moreMo" ||
      location.pathname.slice(0, 7) === "/actor/-" ||
      location.pathname.slice(0, 7) === "/livePl" ||
      location.pathname.slice(0, 7) === "/morede" ||
      location.pathname.slice(0, 6) === "/login"
    ) {
      setIsShowSplash(false);
      setIsShowMenu(false);
    } else {
      setIsShowSplash(false);
      setIsShowMenu(true);
    }
  }, [location]);

  //call webservice for check if user still log in
  const getUserData = async () => {
    try {
      const res = await filimioFetch(
        "https://www.filimo.com/api/fa/v1/partner/TV/profile?devicetype=react_tizen"
      );
      const blocks = await res?.json();
      localStorage.setItem("isOffline", false);

      if (blocks.data.attributes.Profile_kids.kids_lock) {
        setIsKid(true);
        localStorage.setItem("kids-Lock", true);
      } else {
        setIsKid(false);
        localStorage.setItem("kids-Lock", false);
      }

      if (blocks.data?.attributes.is_login) {
        setIsLogin(true);
      }
      if (!blocks.data?.attributes.is_login) {
        setIsLogin(false);
        setJwt(null);
        localStorage.removeItem("jwt");
        localStorage.removeItem("MenuData");
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const checkConnection = async () => {
    try {
      const res = await fetch("https://www.filimo.com/healthz", {
        method: "GET",
        cache: "no-store", // prevent cached results
      });

      setIsOnline(true);
      if (res.status === 204) {
        setIsOnline(true); // online
      }
    } catch (err) {
      setIsOnline(false); // definitely offline
    }
  };

  usePolling(getUserData, 2000, !!jwt);
  usePolling(checkConnection, 300);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("splash_shown");
    if (!splashShown) {
      setIsShowSplash(true);
      sessionStorage.setItem("splash_shown", "true");

      // Hide splash after 3 seconds
      setTimeout(() => {
        setIsShowSplash(false);
      }, 3000);
    }
    //start timer

    localStorage.setItem("mode", "KeyboardMode");
    const handleWheel = (event) => {
      if (localStorage.getItem("mode") === "KeyboardMode") {
        localStorage.setItem("mode", "PointerMode");
      }
    };
    const handleKeyDown = (event) => {
      if (localStorage.getItem("mode") === "PointerMode") {
        localStorage.setItem("mode", "KeyboardMode");
      }
    };
    const handleMouseMove = (event) => {
      if (localStorage.getItem("mode") === "KeyboardMode") {
        localStorage.setItem("mode", "PointerMode");
      }
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading]);

  if (isShowSplash) {
    return <Splash />;
  } else if (!isOnline) {
    return (
      <Alert
        type={"error_player"}
        handleBtnEnter={() => {
          setIsLoading(true);
        }}
      />
    );
  } else {
    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <OnlineStatusContext.Provider
            value={{
              isOnline,
              isSeasonChange,
              setIsSeasonChange,
              isKid,
            }}
          >
            <>
              <Navbar isLogin={isLogin} hidden={!isShowMenu} />
              <AppRoutes isLogin={isLogin} />
            </>
          </OnlineStatusContext.Provider>
        )}
      </>
    );
  }
}

export default App;
