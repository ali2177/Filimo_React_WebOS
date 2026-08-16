import React, { useEffect } from "react";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

const StorySection = ({ story, title = "داستان", focusKey, onArrowPress }) => {
  const { ref, focused } = useFocusable({ focusKey, onArrowPress });

  useEffect(() => {
    if (focused) {
      ref.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [focused, ref]);

  if (!story) return null;

  return (
    <section
      ref={ref}
      className={`movieinfo-detail-story${focused ? " focused" : ""}`}
    >
      <h3 className="u700">{title}</h3>
      <p className="u500">{story}</p>
    </section>
  );
};

export default StorySection;
