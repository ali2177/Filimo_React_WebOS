import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useGetMoviesQuery } from "../../../services/TMDB";
import { safeParse } from "../homeUtils";
import { uiStorage } from "@src/utils/uiStorage";

export function useHomeMovies({ tag_id, other_data, jwt, pageConfig }) {
  const [movies, setMovies] = useState(null);
  const [isNewDataLoading, setIsNewDataLoading] = useState(false);

  const { data, error, isFetching } = useGetMoviesQuery({
    tag_id,
    other_data,
    jwt,
  });

  const isFetchingRef = useRef(isFetching);
  const observer = useRef(null);
  const mountedRef = useRef(true);

  const filteredRows = useMemo(() => {
    if (!movies?.data) return [];
    return movies.data.filter(
      (item) =>
        (item.output_type === "movie" || item.output_type === "livetv") &&
        item.link_text !== null &&
        item.link_text !== "",
    );
  }, [movies]);

  const posterRows = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((item) => item.output_type === "movie");
  }, [data]);

  const persistMoviesToStorage = useCallback(
    (nextMovies) => {
      if (!pageConfig) return;
      localStorage.setItem(pageConfig.cacheKey, JSON.stringify(nextMovies));
    },
    [pageConfig],
  );

  const handlePaginationResult = useCallback(
    (result) => {
      setMovies((prevMovies) => {
        if (!prevMovies) return prevMovies;

        const nextMovies = {
          ...prevMovies,
          links: result?.links,
          data: [...prevMovies.data, ...result.data],
        };

        if (pageConfig) {
          localStorage.setItem(
            pageConfig.focusRowBeforeReloadKey,
            uiStorage.getItem("lastFocusRow") || "",
          );
          persistMoviesToStorage(nextMovies);
        }

        return nextMovies;
      });
    },
    [pageConfig, persistMoviesToStorage],
  );

  const lastMovieElement = useCallback(
    (node) => {
      if (!node) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (!movies?.links?.forward) return;
        if (isFetchingRef.current || isNewDataLoading) return;

        const headers = new Headers();
        if (jwt) {
          headers.append("Authorization", `Bearer ${jwt}`);
        }

        const requestOptions = {
          method: "GET",
          redirect: "follow",
          ...(jwt ? { headers } : {}),
        };

        setIsNewDataLoading(true);

        fetch(`${movies.links.forward}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (!mountedRef.current) return;
            handlePaginationResult(result);
            setIsNewDataLoading(false);
          })
          .catch((fetchError) => {
            if (!mountedRef.current) return;
            console.log("error", fetchError);
            setIsNewDataLoading(false);
          });
      });

      observer.current.observe(node);
    },
    [handlePaginationResult, isNewDataLoading, jwt, movies],
  );

  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  useEffect(() => {
    if (!pageConfig) {
      if (data) setMovies(data);
      return;
    }

    const cached = safeParse(localStorage.getItem(pageConfig.cacheKey));
    if (cached?.data) {
      setMovies(cached);
    } else if (data) {
      setMovies(data);
    }
  }, [data, pageConfig]);

  useEffect(() => {
    const handleBlockingKeyDown = (e) => {
      if (isNewDataLoading) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleBlockingKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleBlockingKeyDown, true);
    };
  }, [isNewDataLoading]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      observer.current?.disconnect();
    };
  }, []);

  return {
    movies,
    setMovies,
    data,
    error,
    isFetching,
    isNewDataLoading,
    lastMovieElement,
    filteredRows,
    posterRows,
  };
}
