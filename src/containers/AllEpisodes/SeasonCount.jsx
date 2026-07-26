import React, { useState, useEffect, useRef } from "react";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import Season from "./Season";

const SeasonCount = ({ data, onEnterPress, autoFocus = true, onExitUp }) => {
  const { ref, focusKey, hasFocusedChild, focusSelf } = useFocusable({
    trackChildren: true,
  });

  // The selected season defaults to the last one (matches the default in
  // AllEpisodes / EpisodesPanel) and follows whichever season is chosen.
  const [activeIndex, setActiveIndex] = useState(data.data.length - 1);

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="season-count">
        {data.data.map((season, index) => (
          <Season
            title={season.link_text}
            count={season.movies.data.length}
            onEnterPress={() => {
              setActiveIndex(index);
              onEnterPress(season);
            }}
            focusKeey={`Season_${index}`}
            autoFocus={autoFocus}
            isFirst={index === 0}
            isActive={index === activeIndex}
            onExitUp={onExitUp}
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
};

export default SeasonCount;
