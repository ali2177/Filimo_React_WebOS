import React, { useState, useEffect, useRef } from "react";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
import Season from "./Season";

const SeasonCount = ({ data, onEnterPress }) => {
  const { ref, focusKey, hasFocusedChild, focusSelf } = useFocusable({
    trackChildren: true,
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div className="season-count">
        {data.data.map((season, index) => (
          <Season
            title={season.link_text}
            count={season.movies.data.length}
            onEnterPress={() => {
              onEnterPress(season);
            }}
            focusKeey={`Season_${index}`}
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
};

export default SeasonCount;
