import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, useLocation, useNavigation } from "react-router-dom";
import useNetworkStatus from "../utils/useNetworkStatus";
import {
  Movies,
  Actors,
  MovieInfo,
  Navbar,
  Profile,
  TvPlayer,
  Search,
} from "./index";
import Splash from "./Splash";
import SpatialNavigation from "react-js-spatial-navigation";
import "./App.css";
import MoreMovies from "./MoreMovies/MoreMovies";
import Categories from "./Categories/Categories";
import Loogin from "./Login/Loogin";
import MoreCategory from "./MoreCategory/MoreCategory";
import MyMovies from "./MyMovies/MyMovies";
import Crew from "./Crew/Crew";
// const MENU_FOCUS_KEY = 'MENU';
import {
  init,
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import MoreReccom from "./MoreReccom/MoreReccom";
import SearchResult from "./Search/SearchResult";
import AllEpisodes from "./AllEpisodes/AllEpisodes";
import MoreSingle from "./AllEpisodes/AllEpisodesSingle";
import Ip from "./Ip/Ip";
import UsersProfile from "./UsersProfile/UsersProfile";
import MoreMovieSingle from "./MoreMovies/MoreMovieSingle";
import LivePlayer from "./Player/LivePlayer";
import MoreDetail from "./MovieInfo/MoreDetail/MoreDetail";
import MoreMovieWeb from "./MoreMovies/MoreMovieWebsevice";
import UsersProfileCode from "./UsersProfile/UsersProfileCode";
import Alert from "./Alert/Alert";
import Loader from "./Loader/Loader";
import { useAuth } from "./AuthProvider";

init({
  debug: false,
  rtl: true,
});

// Create Context
const OnlineStatusContext = createContext();
export const useOnlineStatus = () => useContext(OnlineStatusContext);

function App() {
  const { jwt, setJwt } = useAuth();

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
  const getUserData = async (jwt) => {
    try {
      const userAgent = {
        os: "WebOs",
        an: "Filimo",
        vn: "1.00",
      };
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/partner/TV/profile?devicetype=react_tizen`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            UserAgent: JSON.stringify(userAgent),
          },
        }
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

  //start timer when user login
  useEffect(() => {
    //start timer
    if (jwt) {
      var intervalCall = setInterval(() => {
        // setJwt(localStorage.getItem("jwt"));
        // jwt = localStorage.getItem("jwt");
        getUserData(jwt);
      }, 2000);
    }

    ///end timer when user log out
    if (jwt == null) {
      clearInterval(intervalCall);
    }
    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, [jwt]);
  //start timer when user login
  useEffect(() => {
    var intervalCall = setInterval(() => {
      checkConnection();
    }, 300);
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
      clearInterval(intervalCall);
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
              <Routes>
                <Route exact path="/ipcheck" element={<Ip />} />
                <Route exact path="/" element={<Movies isLogin={isLogin} />} />
                <Route
                  exact
                  path="/movies/filter/:tag_id/:other_data"
                  element={<Movies isLogin={isLogin} />}
                />
                <Route
                  exact
                  path="/approved"
                  element={<Movies isLogin={isLogin} />}
                />
                <Route
                  exact
                  path="/movie/:id"
                  element={<MovieInfo isLogin={isLogin} />}
                />
                <Route
                  exact
                  path="/moremovies/:tag_id"
                  element={<MoreMovies />}
                />
                <Route
                  exact
                  path="/moreSingle/:id/:title"
                  element={<MoreSingle />}
                />
                <Route
                  exact
                  path="/moreMovieSingle"
                  element={<MoreMovieSingle />}
                />
                <Route
                  exact
                  path="/profileLockCode"
                  element={<UsersProfileCode />}
                />
                <Route
                  exact
                  path="/moreMovieWeb/:tag_id"
                  element={<MoreMovieWeb />}
                />
                <Route exact path="/morereccom/:id" element={<MoreReccom />} />
                <Route exact path="/moredetail/:id" element={<MoreDetail />} />
                <Route
                  exact
                  path="/morecategory/:tag_id"
                  element={<MoreCategory />}
                />
                <Route exact path="/actor/:crew_name" element={<Crew />} />
                <Route
                  exact
                  path="/allepisodes/:ui_id"
                  element={<AllEpisodes />}
                />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/player" element={<TvPlayer />} />
                <Route exact path="/livePlayer" element={<LivePlayer />} />
                <Route exact path="/usersProfile" element={<UsersProfile />} />

                <Route exact path="/categories" element={<Categories />} />
                <Route exact path="/login" element={<Loogin />} />
                <Route exact path="/search" element={<Search />} />
                <Route exact path="/searchResult" element={<SearchResult />} />

                <Route
                  exact
                  path="/mymovies"
                  element={<MyMovies isLogin={isLogin} />}
                />
              </Routes>
            </>
          </OnlineStatusContext.Provider>
        )}
      </>
    );
  }
}

export default App;
