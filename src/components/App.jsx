import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigation } from "react-router-dom";
import {
  Movies,
  Actors,
  MovieInfo,
  Navbar,
  Profile,
  TvPlayer,
  Search,
} from "./index";
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

init({
  debug: false,
  visualDebug: false,
  rtl: true,
});

function App() {
  const location = useLocation("");
  const [isShowMenu, setIsShowMenu] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  let jwt = localStorage.getItem("jwt");

  //check when we are in movieinfo or player or login page and dont show the menu
  useEffect(() => {
    jwt = localStorage.getItem("jwt");
    if (jwt) {
      setIsLogin(true);
    }
    console.log(location.pathname.slice(0, 7));

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
      location.pathname.slice(0, 6) === "/login"
    ) {
      setIsShowMenu(false);
    } else {
      setIsShowMenu(true);
    }
  }, [location]);

  //call webservice for check if user still log in
  const getUserData = async (jwt) => {
    try {
      const res = await fetch(
        `https://www.televika.com/api/fa/v1/partner/TV/profile`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const blocks = await res?.json();

      if (blocks.data?.attributes.is_login) {
        setIsLogin(true);
      }
      if (!blocks.data?.attributes.is_login) {
        setIsLogin(false);
        localStorage.removeItem("jwt");
      }
    } catch (e) {
      console.log(e);
    }
  };

  //start timer when user login
  useEffect(() => {
    //start timer
    if (jwt) {
      var intervalCall = setInterval(() => {
        jwt = localStorage.getItem("jwt");
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

  return (
    <SpatialNavigation>
      <div className="root">
        {isShowMenu ? <Navbar isLogin={isLogin} /> : null}

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
          <Route exact path="/moremovies/:tag_id" element={<MoreMovies />} />
          <Route exact path="/moreSingle/:title" element={<MoreSingle />} />
          <Route exact path="/morereccom/:id" element={<MoreReccom />} />
          <Route
            exact
            path="/morecategory/:tag_id"
            element={<MoreCategory />}
          />
          <Route exact path="/actor/:crew_name" element={<Crew />} />
          <Route exact path="/allepisodes/:ui_id" element={<AllEpisodes />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/player" element={<TvPlayer />} />
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
      </div>
    </SpatialNavigation>
  );
}

export default App;
