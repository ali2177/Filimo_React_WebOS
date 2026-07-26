import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useOnlineStatus } from "@src/app/App";
import { uiStorage } from "@src/utils/uiStorage";
import { useGetAllEpisodesQuery } from "@src/services/TMDB";
import NetworkError from "@src/components/NetworkError/NetworkError";
import Loader from "@src/components/Loader/Loader";
import SeasonCount from "@src/containers/AllEpisodes/SeasonCount.jsx";
import EpisodesWrapper from "@src/containers/AllEpisodes/EpisodesWrapper.jsx";

const EpisodesPanel = forwardRef(({ uid, onExitUp }, ref) => {
  const { setIsSeasonChange, isSeasonChange } = useOnlineStatus();
  const { data, error, isFetching } = useGetAllEpisodesQuery(uid);
  const [isLoading, setIsLoading] = useState(false);
  const [curretSeasonChosen, setCurretSeasonChosen] = useState(null);

  useEffect(() => {
    setCurretSeasonChosen(data?.data[data.data.length - 1]?.movies?.data);
  }, [data]);

  useImperativeHandle(ref, () => ({
    focusFirst: () => setFocus("Season_0"),
  }));

  const HandleSeasonEnterPress = (season) => {
    uiStorage.setItem(
      "lastSeasonFocus_parent_new",
      season.movies?.data[0].serial_parent_new,
    );
    uiStorage.setItem(
      "lastSeasonFocus_season_part",
      season.movies?.data[0].serial_season_part,
    );
    setIsLoading(true);
    setCurretSeasonChosen(season.movies.data);
    setIsSeasonChange(!isSeasonChange);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (error) return <NetworkError />;

  if (isFetching || isLoading) return <Loader />;

  if (!data?.data || data.data.length === 0)
    return <NetworkError errorText="دیتایی یافت نشد" />;

  return (
    <div className="movieinfo-episodes-panel">
      <div className="allepisode-content-wrapper">
        <SeasonCount
          data={data}
          onEnterPress={HandleSeasonEnterPress}
          autoFocus={false}
          onExitUp={onExitUp}
        />
        <EpisodesWrapper
          data={data}
          curretSeasonChosen={curretSeasonChosen}
          onExitUp={onExitUp}
        />
      </div>
    </div>
  );
});

export default EpisodesPanel;
