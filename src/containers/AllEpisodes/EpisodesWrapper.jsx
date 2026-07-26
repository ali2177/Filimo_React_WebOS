import React, { useState, useRef, useCallback, useEffect } from "react";
import { useDisableKeyboardWhileLoading } from "@src/hooks/useDisableKeyboardWhileLoading";
import { useFilimioFetch } from "@src/hooks/useFilimioFetch";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import { useAuth } from "@src/components/AuthProvider";
import { useOnlineStatus } from "@src/app/App";
import Episode from "./Episode";
import Loader from "@src/components/Loader/Loader";
import { uiStorage } from "@src/utils/uiStorage";

const EpisodesWrapper = ({
  curretSeasonChosen,
  curretSeasonDetail,
  links,
  data,
  onExitUp,
}) => {
  const { jwt, setJwt } = useAuth();
  const { isOnline, isSeasonChange } = useOnlineStatus();
  const filimioFetch = useFilimioFetch();
  const observer = useRef();
  const [isNewDataLoading, setIsNewDataLoading] = useState(false);
  const [episodes, setEpisodes] = useState(null);
  const [linkForward, setLinkForward] = useState(links);
  const { ref, focusKey, hasFocusedChild, focusSelf } = useFocusable({
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "right"],
  });

  useDisableKeyboardWhileLoading(isNewDataLoading);

  useEffect(() => {
    if (uiStorage.getItem("lastSeasonFocus_parent_new")) {
      getUserData(
        uiStorage.getItem("lastSeasonFocus_parent_new"),
        uiStorage.getItem("lastSeasonFocus_season_part"),
      );
    } else {
      getUserData(
        data?.data[data.data.length - 1].movies?.data[0].serial_parent_new,
        data?.data[data.data.length - 1].movies?.data[0].serial_season_part,
      );
    }
  }, [data]);
  useEffect(() => {
    if (uiStorage.getItem("lastSeasonFocus_parent_new")) {
      getUserData(
        uiStorage.getItem("lastSeasonFocus_parent_new"),
        uiStorage.getItem("lastSeasonFocus_season_part"),
      );
    }
  }, [isSeasonChange]);

  const getUserData = async (parent_id, part) => {
    try {
      const res = await filimioFetch(
        `https://www.filimo.com/api/fa/v1/movie/serial/episodebyseason/parent_id/${parent_id}/part/${part}/sort/DESC/perpage/4?json_type=simple`,
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
    [episodes],
  );
  return (
    <FocusContext.Provider value={focusKey}>
      <div
        style={{
          height: "44rem",
          overflowY: "scroll",
          paddingBottom: "3.5rem",
          boxSizing: "border-box",
        }}
      >
        {episodes &&
          episodes.map((movieItem, index) => (
            <div ref={lastMovieElement}>
              <Episode
                movieItem={movieItem}
                focusKeey={`Episode_${index}`}
                isFirst={index === 0}
                onExitUp={onExitUp}
              />
            </div>
          ))}
      </div>
    </FocusContext.Provider>
  );
};

export default EpisodesWrapper;
