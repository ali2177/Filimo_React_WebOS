import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

const Home            = React.lazy(() => import('@containers/Home/Home'));
const MovieInfo       = React.lazy(() => import('@containers/MovieInfo/MovieInfo'));
const MoreMovies      = React.lazy(() => import('@containers/MoreMovies/MoreMovies'));
const MoreSingle      = React.lazy(() => import('@containers/AllEpisodes/AllEpisodesSingle'));
const MoreMovieSingle = React.lazy(() => import('@containers/MoreMovies/MoreMovieSingle'));
const UsersProfileCode = React.lazy(() => import('@containers/UsersProfile/UsersProfileCode'));
const MoreMovieWeb    = React.lazy(() => import('@containers/MoreMovies/MoreMovieWebsevice'));
const MoreReccom      = React.lazy(() => import('@containers/MoreReccom/MoreReccom'));
const MoreDetail      = React.lazy(() => import('@containers/MovieInfo/MoreDetail/MoreDetail'));
const MoreCategory    = React.lazy(() => import('@containers/MoreCategory/MoreCategory'));
const Crew            = React.lazy(() => import('@containers/Crew/Crew'));
const AllEpisodes     = React.lazy(() => import('@containers/AllEpisodes/AllEpisodes'));
const Profile         = React.lazy(() => import('@containers/Profile/Profile'));
const TvPlayer        = React.lazy(() => import('@containers/Player/TvPlayer'));
const LivePlayer      = React.lazy(() => import('@containers/Player/LivePlayer'));
const UsersProfile    = React.lazy(() => import('@containers/UsersProfile/UsersProfile'));
const Categories      = React.lazy(() => import('@containers/Categories/Categories'));
const Loogin          = React.lazy(() => import('@containers/Login/Loogin'));
const Search          = React.lazy(() => import('@containers/Search/Search'));
const SearchResult    = React.lazy(() => import('@containers/Search/SearchResult'));
const MyMovies        = React.lazy(() => import('@containers/MyMovies/MyMovies'));
const Ip              = React.lazy(() => import('@containers/Ip/Ip'));
const Settings        = React.lazy(() => import('@containers/Settings/Settings'));

// Navigating between movies (e.g. from the "similar" / episodes tabs) keeps the
// same /movie/:id route matched, so React reuses the mounted MovieInfo instance
// and only the `id` param changes. All of MovieInfo's fetch/reset effects run on
// mount only, so the page content would go stale. Keying by `id` forces a fresh
// remount on every movie change, which refetches, resets tabs, and scrolls to top.
function MovieInfoRoute({ isLogin }) {
  const { id } = useParams();
  return <MovieInfo key={id} isLogin={isLogin} />;
}

function AppRoutes({ isLogin }) {
  return (
    <React.Suspense fallback={null}>
      <Routes>
        <Route path="/ipcheck" element={<Ip />} />
        <Route path="/" element={<Home isLogin={isLogin} />} />
        <Route path="/movies/filter/:tag_id/:other_data" element={<Home isLogin={isLogin} />} />
        <Route path="/approved" element={<Home isLogin={isLogin} />} />
        <Route path="/movie/:id" element={<MovieInfoRoute isLogin={isLogin} />} />
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
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </React.Suspense>
  );
}

export default AppRoutes;
