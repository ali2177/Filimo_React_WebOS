import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.televika.com/api/fa/v1/",
    prepareHeaders(headers) {
      const token = localStorage.getItem("jwt");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  //baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  endpoints: (builder) => ({
    // Get Genres
    getGenres: builder.query({
      query: () => `/genre/movie/list?api_key=${tmdbApiKey}`,
    }),

    // Get Movies by [Type]
    getMovies: builder.query({
      query: ({ tag_id, other_data, jwt = "123456789" }) => {
        // Get Movies by Filters
        if (tag_id || other_data) {
          return `/movie/movie/list/tagid/${tag_id}/other_data/${other_data}/?json_type=simple`;
        }

        return `movie/movie/list/tagid/1/list_perpage/25/list_offset/0?json_type=simple&device_type=react_tizen`;
      },
    }),

    // Get More movies
    getMoreMovies: builder.query({
      query: ({ tag_id }) => {
        // Get more movies
        if (tag_id) {
          return `/movie/movie/list/tagid/${tag_id}/?json_type=simple`;
        }
      },
    }),

    // Get categories
    getCategories: builder.query({
      query: ({ tag_id }) => {
        if (tag_id) {
          return `/movie/movie/list/tagid/${tag_id}/?json_type=simple&device_type=react_tizen`;
        }
        return `/category/category/list`;
      },
    }),

    // Get Movie
    getMovie: builder.query({
      query: ({ id }) =>
        `/movie/movie/one/uid/${id}/devicetype/tizen_react?json_type=simple`,
    }),
    // Get Movie Detail
    getMovieDetail: builder.query({
      query: ({ id }) =>
        `/review/review/moviedetail/uid/${id}?json_type=simple`,
    }),
    getMovieRecom: builder.query({
      query: ({ id }) => `/movie/movie/recom/uid/${id}?json_type=simple`,
    }),
    // Get my Movie
    getMyMovie: builder.query({
      query: () => `/bookmark`,
    }),
    // Get Subtitle
    getSubtitle: builder.query({
      query: ({ subuid }) => `/subtitle/${subuid}`,
    }),

    // Get Login code
    getLoginCode: builder.query({
      query: ({ code }) => {
        if (code) {
          return `/login/get-code/api/login/sync-code/${code}`;
        }
        return `/login/get-code`;
      },
    }),

    // Get Recommendations
    getRecommendations: builder.query({
      query: ({ movie_id, list }) =>
        `/movie/${movie_id}/${list}?api_key=${tmdbApiKey}`,
    }),

    // Get Actor
    getActor: builder.query({
      query: (crew_name) =>
        `/movie/movie/list/tagid/1000300/text/${crew_name}/fl/crew`,
    }),
    // Get All episodes
    getAllEpisodes: builder.query({
      query: (ui_id) =>
        `/movie/serial/allepisode/uid/${ui_id}?json_type=simple`,
    }),

    // Get Movies by Actor
    getMoviesByActorId: builder.query({
      query: ({ id, page }) =>
        `/discover/movie?with_cast=${id}&page=${page}&api_key=${tmdbApiKey}`,
    }),

    // Get User Specific Lists
    getList: builder.query({
      query: ({ listName, accountId, sessionId, page }) =>
        `/account/${accountId}/${listName}?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${page}`,
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetMoviesQuery,
  useGetMoreMoviesQuery,
  useGetCategoriesQuery,
  useGetMovieQuery,
  useGetMovieDetailQuery,
  useGetMovieRecomQuery,
  useGetMyMovieQuery,
  useGetSubtitleQuery,
  useGetLoginCodeQuery,
  useGetRecommendationsQuery,
  useGetActorQuery,
  useGetAllEpisodesQuery,
  useGetMoviesByActorIdQuery,
  useGetListQuery,
} = tmdbApi;
