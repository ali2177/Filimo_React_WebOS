import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import { useAuth } from "../AuthProvider";
import { useOnlineStatus } from "../App";
import Episode from "./Episode";
import Loader from "../Loader/Loader";

const EpisodesWrapper = ({
  curretSeasonChosen,
  curretSeasonDetail,
  links,
  data,
}) => {
  const { jwt, setJwt } = useAuth();
  const { isOnline, isSeasonChange } = useOnlineStatus();
  const observer = useRef();
  const [isNewDataLoading, setIsNewDataLoading] = useState(false);
  const [episodes, setEpisodes] = useState(null);
  const [linkForward, setLinkForward] = useState(links);
  const { ref, focusKey, hasFocusedChild, focusSelf } = useFocusable({
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "right"],
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isNewDataLoading) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isNewDataLoading]);

  useEffect(() => {
    if (localStorage.getItem("lastSeasonFocus_parent_new")) {
      getUserData(
        localStorage.getItem("jwt"),
        localStorage.getItem("lastSeasonFocus_parent_new"),
        localStorage.getItem("lastSeasonFocus_season_part")
      );
    } else {
      getUserData(
        localStorage.getItem("jwt"),
        data?.data[data.data.length - 1].movies?.data[0].serial_parent_new,
        data?.data[data.data.length - 1].movies?.data[0].serial_season_part
      );
    }
  }, [data]);
  useEffect(() => {
    if (localStorage.getItem("lastSeasonFocus_parent_new")) {
      getUserData(
        localStorage.getItem("jwt"),
        localStorage.getItem("lastSeasonFocus_parent_new"),
        localStorage.getItem("lastSeasonFocus_season_part")
      );
    }
  }, [isSeasonChange]);

  const getUserData = async (jwt, parent_id, part) => {
    try {
      const userAgent = {
        os: "WebOs",
        an: "Filimo",
        vn: "1.00",
      };
      const res = await fetch(
        `https://www.filimo.com/api/fa/v1/movie/serial/episodebyseason/parent_id/${parent_id}/part/${part}/sort/DESC/perpage/4?json_type=simple`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            UserAgent: JSON.stringify(userAgent),
          },
        }
      );
      const blocks = await res?.json();
      // console.log(blocks.data[0]);
      if (blocks) {
        setLinkForward(blocks?.links?.paging);
        if (blocks?.data) setEpisodes(blocks?.data[0].movies.data);
        setIsNewDataLoading(false);
      }
    } catch (e) {
      // console.log(e);
    }
  };

  const lastMovieElement = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          var myHeaders = new Headers();
          if (jwt) {
            myHeaders.append("Authorization", `Bearer ${jwt}`);
            var requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };
          } else {
            var requestOptions = {
              method: "GET",
              redirect: "follow",
            };
          }

          if (linkForward) {
            setIsNewDataLoading(true);
            setTimeout(() => {
              setIsNewDataLoading(false);
            }, 5000);
            fetch(`${linkForward}`, requestOptions)
              .then((response) => response.json())
              .then((result) => {
                setEpisodes((prevmovies) => [...episodes, ...result.included]);
                if (result.links) {
                  setLinkForward(result.links.paging);
                } else {
                  setLinkForward(null);
                }
                setIsNewDataLoading(false);
              })
              .catch((error) => console.log("error", error));
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [episodes]
  );
  return (
    <FocusContext.Provider value={focusKey}>
      <div style={{ height: "41.6rem", overflowY: "scroll" }}>
        {episodes &&
          episodes.map((movieItem, index) => (
            <div ref={lastMovieElement}>
              <Episode movieItem={movieItem} focusKeey={`Episode_${index}`} />
            </div>
          ))}
      </div>
    </FocusContext.Provider>
  );
};

export default EpisodesWrapper;
