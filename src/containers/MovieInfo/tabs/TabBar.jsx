import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";

export const tabFocusKey = (key) => `movieinfo-tab-${key}`;

const TabItem = ({
  tab,
  tabs,
  index,
  active,
  onTabFocus,
  onExitUp,
  onEnterDown,
  registerNode,
}) => {
  const focusKey = tabFocusKey(tab.key);
  const { ref, focused } = useFocusable({
    focusKey,
    onFocus: () => onTabFocus(tab.key),
    onArrowPress: (direction) => {
      if (direction === "up") {
        onExitUp();
        return false;
      }
      if (direction === "down") {
        onEnterDown();
        return false;
      }
      // Move between tabs deterministically instead of letting norigin guess
      // from bounding boxes — that geometric search misfires on Tizen's webview
      // (sticky strip inside a scrolled container) and can strand focus so the
      // recomm tab never activates. The strip is RTL: physical left = next tab
      // (index+1, further left), right = previous (index-1).
      const next = tabs[index + (direction === "left" ? 1 : -1)];
      if (next) {
        setFocus(tabFocusKey(next.key));
        return false;
      }
      // At an edge: stay put rather than escaping into panel content.
      return false;
    },
  });

  const setRefs = useCallback(
    (node) => {
      ref.current = node;
      registerNode(tab.key, node);
    },
    [ref, registerNode, tab.key],
  );

  return (
    <div
      ref={setRefs}
      className={
        "movieinfo-tab u500" +
        (focused ? " movieinfo-tab--focused" : "") +
        (active ? " movieinfo-tab--active" : "")
      }
      // onMouseEnter={() => setFocus(focusKey)}
      onClick={() => setFocus(focusKey)}
    >
      {tab.label}
    </div>
  );
};

const TabBar = ({
  tabs,
  activeTab,
  onTabFocus,
  onExitUp,
  onEnterDown,
  pinned,
}) => {
  const { ref, focusKey } = useFocusable({ trackChildren: true });
  const navRef = useRef(null);
  const nodesRef = useRef({});
  const [indicator, setIndicator] = useState(null);

  const setNavRef = useCallback(
    (node) => {
      ref.current = node;
      navRef.current = node;
    },
    [ref],
  );

  const registerNode = useCallback((key, node) => {
    if (node) {
      nodesRef.current[key] = node;
    } else {
      delete nodesRef.current[key];
    }
  }, []);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const node = nodesRef.current[activeTab];
      if (!node) return;
      setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
    };

    updateIndicator();

    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab, tabs]);

  return (
    <FocusContext.Provider value={focusKey}>
      <nav
        ref={setNavRef}
        className={"movieinfo-tabs" + (pinned ? " movieinfo-tabs--pinned" : "")}
      >
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.key}
            tab={tab}
            tabs={tabs}
            index={index}
            active={activeTab === tab.key}
            onTabFocus={onTabFocus}
            onExitUp={onExitUp}
            onEnterDown={onEnterDown}
            registerNode={registerNode}
          />
        ))}
        {indicator && (
          <div
            className="movieinfo-tab-indicator"
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: `${indicator.width}px`,
            }}
          />
        )}
      </nav>
    </FocusContext.Provider>
  );
};

export default TabBar;
