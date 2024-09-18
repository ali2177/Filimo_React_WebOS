import axios from "axios";
import home from "../assets/genres/home.svg";
import movies from "../assets/genres/movies.svg";
import series from "../assets/genres/series.svg";
import folder from "../assets/genres/folder.svg";
import live from "../assets/genres/live.svg";
import iran from "../assets/genres/iran.svg";
import kids from "../assets/genres/kids.svg";
import support from "../assets/genres/support.svg";
import contries from "../assets/genres/contries.svg";
import categories from "../assets/genres/categories.svg";
import mymovies from "../assets/genres/myMovies.svg";
import search from "../assets/genres/search.svg";
import profile from "../assets/images/profile.svg";

export const moviesApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.REACT_APP_TMDB_KEY,
  },
});

export const fetchToken = async () => {
  try {
    const { data } = await moviesApi.get("/authentication/token/new");

    const token = data.request_token;

    if (data.success) {
      localStorage.setItem("request_token", token);
      window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${window.location.origin}/approved`;
    }
  } catch (error) {
    console.log("Sorry, your token could not be created.");
  }
};

export const createSessionId = async () => {
  const token = localStorage.getItem("request_token");

  if (token) {
    try {
      const {
        data: { session_id },
      } = await moviesApi.post("authentication/session/new", {
        request_token: token,
      });
      localStorage.setItem("session_id", session_id);

      return session_id;
    } catch (error) {
      console.log(error);
    }
  }
};

export const stripHtmlTags = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const genreIcons = {
  home,
  movies,
  series,
  folder,
  live,
  iran,
  kids,
  support,
  contries,
  categories,
  mymovies,
  search,
  profile,
};

export const categoriiesIfSignIn = [
  { label: "حساب کاربری", value: "profile", icon: "profile" },
  { label: "جستجو", value: "search", icon: "search" },
  { label: "صفحه اصلی", value: "/", icon: "home" },
  {
    label: "فیلم ها",
    value: "top_rated",
    icon: "movies",
    tag_id: "1",
    other_data: "movie",
  },
  {
    label: "سریال ها",
    value: "upcoming",
    icon: "series",
    tag_id: "1",
    other_data: "series",
  },
  // { label: "فیلم های من", value: "mymovies", icon: "myMovies" },
  {
    label: "ایرانی",
    value: "upcoming",
    icon: "iran",
    tag_id: "1",
    other_data: "iran",
  },
  {
    label: "مجموعه ها",
    value: "cat",
    icon: "folder",
    other_data: "categories",
  },
  {
    label: "کودک",
    value: "upcoming",
    icon: "kids",
    tag_id: "2001215",
    other_data: "kids",
  },
  // {
  //   label: "کشورها",
  //   value: "contries",
  //   icon: "contries",
  //   list: [
  //     { contName: "ایران", contValue: "iran" },
  //     { contName: "آمریکا", contValue: "america" },
  //     { contName: "ژاپن", contValue: "japan" },
  //     { contName: "انگلیس", contValue: "england" },
  //     { contName: "کره جنوبی", contValue: "s_korea" },
  //     { contName: "ترکیه", contValue: "turkey" },
  //   ],
  // },
];

export const categoriiesIfNotSignIn = [
  { label: "ورود", value: "login", icon: "live" },
  { label: "جستجو", value: "search", icon: "search" },
  { label: "صفحه اصلی", value: "/", icon: "home" },
  {
    label: "فیلم ها",
    value: "top_rated",
    icon: "movies",
    tag_id: "1",
    other_data: "movie",
  },
  {
    label: "سریال ها",
    value: "upcoming",
    icon: "series",
    tag_id: "1",
    other_data: "series",
  },
  {
    label: "ایرانی",
    value: "upcoming",
    icon: "iran",
    tag_id: "1",
    other_data: "iran",
  },
  {
    label: "مجموعه ها",
    value: "cat",
    icon: "folder",
    other_data: "categories",
  },
  {
    label: "کودک",
    value: "upcoming",
    icon: "kids",
    tag_id: "2001215",
    other_data: "kids",
  },
  // {
  //   label: "کشورها",
  //   value: "contries",
  //   icon: "contries",
  //   tag_id: "1",
  //   list: [
  //     { contName: "ایران", contValue: "iran" },
  //     { contName: "آمریکا", contValue: "america" },
  //     { contName: "ژاپن", contValue: "japan" },
  //     { contName: "انگلیس", contValue: "england" },
  //     { contName: "کره جنوبی", contValue: "s_korea" },
  //     { contName: "ترکیه", contValue: "turkey" },
  //   ],
  // },
];
