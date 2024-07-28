import React from "react";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import Episode from "./Episode";

const EpisodesWrapper = ({ curretSeasonChosen, curretSeasonDetail }) => {
  const { ref, focusKey, hasFocusedChild, focusSelf } = useFocusable({
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["down", "up", "right"],
  });
  return (
    <FocusContext.Provider value={focusKey}>
      <div style={{ height: "810px", overflowY: "scroll" }}>
        {curretSeasonDetail &&
          curretSeasonDetail.movies.data.map((movieItem, index) => (
            <Episode movieItem={movieItem} focusKeey={`Episode_${index}`} />
          ))}
      </div>
    </FocusContext.Provider>
  );
};

export default EpisodesWrapper;
