import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Home            = React.lazy(() => import('../components/Home/Home'));
const MovieInfo       = React.lazy(() => import('../components/MovieInfo/MovieInfo'));
const MoreMovies      = React.lazy(() => import('../components/MoreMovies/MoreMovies'));
const MoreSingle      = React.lazy(() => import('../components/AllEpisodes/AllEpisodesSingle'));
const MoreMovieSingle = React.lazy(() => import('../components/MoreMovies/MoreMovieSingle'));
const UsersProfileCode = React.lazy(() => import('../components/UsersProfile/UsersProfileCode'));
const MoreMovieWeb    = React.lazy(() => import('../components/MoreMovies/MoreMovieWebsevice'));
const MoreReccom      = React.lazy(() => import('../components/MoreReccom/MoreReccom'));
const MoreDetail      = React.lazy(() => import('../components/MovieInfo/MoreDetail/MoreDetail'));
const MoreCategory    = React.lazy(() => import('../components/MoreCategory/MoreCategory'));
const Crew            = React.lazy(() => import('../components/Crew/Crew'));
const AllEpisodes     = React.lazy(() => import('../components/AllEpisodes/AllEpisodes'));
const Profile         = React.lazy(() => import('../components/Profile/Profile'));
const TvPlayer        = React.lazy(() => import('../components/Player/TvPlayer'));
const LivePlayer      = React.lazy(() => import('../components/Player/LivePlayer'));
const UsersProfile    = React.lazy(() => import('../components/UsersProfile/UsersProfile'));
const Categories      = React.lazy(() => import('../components/Categories/Categories'));
const Loogin          = React.lazy(() => import('../components/Login/Loogin'));
const Search          = React.lazy(() => import('../components/Search/Search'));
const SearchResult    = React.lazy(() => import('../components/Search/SearchResult'));
const MyMovies        = React.lazy(() => import('../components/MyMovies/MyMovies'));
const Ip              = React.lazy(() => import('../components/Ip/Ip'));

function AppRoutes({ isLogin }) {
  return (
    <React.Suspense fallback={null}>
      <Routes>
        <Route path="/ipcheck" element={<Ip />} />
        <Route path="/" element={<Home isLogin={isLogin} />} />
        <Route path="/movies/filter/:tag_id/:other_data" element={<Home isLogin={isLogin} />} />
        <Route path="/approved" element={<Home isLogin={isLogin} />} />
        <Route path="/movie/:id" element={<MovieInfo isLogin={isLogin} />} />
        <Route path="/moremovies/:tag_id" element={<MoreMovies />} />
        <Route path="/moreSingle/:id/:title" element={<MoreSingle />} />
        <Route path="/moreMovieSingle" element={<MoreMovieSingle />} />
        <Route path="/profileLockCode" element={<UsersProfileCode />} />
        <Route path="/moreMovieWeb/:tag_id" element={<MoreMovieWeb />} />
        <Route path="/morereccom/:id" element={<MoreReccom />} />
        <Route path="/moredetail/:id" element={<MoreDetail />} />
        <Route path="/morecategory/:tag_id" element={<MoreCategory />} />
        <Route path="/actor/:crew_name" element={<Crew />} />
        <Route path="/allepisodes/:ui_id" element={<AllEpisodes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/player" element={<TvPlayer />} />
        <Route path="/livePlayer" element={<LivePlayer />} />
        <Route path="/usersProfile" element={<UsersProfile />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Loogin />} />
        <Route path="/search" element={<Search />} />
        <Route path="/searchResult" element={<SearchResult />} />
        <Route path="/mymovies" element={<MyMovies isLogin={isLogin} />} />
      </Routes>
    </React.Suspense>
  );
}

export default AppRoutes;
