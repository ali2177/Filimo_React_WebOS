import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FocusContext,
  useFocusable,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import {
  useRateMovieMutation,
  useToggleBookmarkMutation,
} from "@src/services/TMDB";
import BookmarkIcon from "./icons/BookmarkIcon";
import LikeIcon from "./icons/LikeIcon";
import DislikeIcon from "./icons/DislikeIcon";

// A single circular icon button. `active` drives the persistent toggled look
// (white bg + dark icon), independent of TV-remote focus. Mirrors the player's
// PlayerButton focus pattern.
const ActionButton = ({ focusKey: fk, active, onAction, children }) => {
  const { ref, focused, focusKey } = useFocusable({
    focusKey: fk,
    onEnterPress: onAction,
  });

  const className = [
    "action-btn",
    active ? "action-btn-active" : "",
    focused ? "action-btn-focus" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        ref={ref}
        className={className}
        onMouseEnter={() => setFocus(focusKey)}
        onClick={onAction}
      >
        {children}
      </div>
    </FocusContext.Provider>
  );
};

const ActionButtons = ({ actionData, general, isLogin }) => {
  const navigate = useNavigate();
  const [rateMovie] = useRateMovieMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const [liked, setLiked] = useState(
    actionData?.rate?.user?.rate_status === "like",
  );
  const [disliked, setDisliked] = useState(
    actionData?.rate?.user?.rate_status === "dislike",
  );
  const [bookmarked, setBookmarked] = useState(
    actionData?.wish?.icon != null && actionData?.wish?.icon !== "add_circle",
  );

  // Per-title visibility gate. `active_features` is the reliable signal; when
  // it's absent we fail-visible and show everything.
  const features = Array.isArray(general?.active_features)
    ? general.active_features
    : null;
  const showRate =
    !features ||
    features.includes("rate_show") ||
    features.includes("rate_send");
  const showBookmark = !features || features.includes("bookmark_send");

  if (!showRate && !showBookmark) return null;

  const likeUrl = actionData?.rate?.user?.like_url;
  const dislikeUrl = actionData?.rate?.user?.dislike_url;
  const wishUrl = actionData?.wish?.link;

  // The API returns the literal "signin" for these URLs when logged out; treat
  // that (or a missing url / logged-out session) as "go to login".
  const needsLogin = (url) => !isLogin || !url || url === "signin";

  const handleLike = () => {
    if (needsLogin(likeUrl)) {
      navigate("/login");
      return;
    }
    const prevLiked = liked;
    const prevDisliked = disliked;
    setLiked(!prevLiked);
    if (!prevLiked) setDisliked(false);
    rateMovie({ url: likeUrl })
      .unwrap()
      .catch(() => {
        setLiked(prevLiked);
        setDisliked(prevDisliked);
      });
  };

  const handleDislike = () => {
    if (needsLogin(dislikeUrl)) {
      navigate("/login");
      return;
    }
    const prevLiked = liked;
    const prevDisliked = disliked;
    setDisliked(!prevDisliked);
    if (!prevDisliked) setLiked(false);
    rateMovie({ url: dislikeUrl })
      .unwrap()
      .catch(() => {
        setLiked(prevLiked);
        setDisliked(prevDisliked);
      });
  };

  const handleBookmark = () => {
    if (needsLogin(wishUrl)) {
      navigate("/login");
      return;
    }
    const prev = bookmarked;
    setBookmarked(!prev);
    toggleBookmark({ url: wishUrl })
      .unwrap()
      .catch(() => setBookmarked(prev));
  };

  return (
    <div className="action-buttons">
      {showBookmark && (
        <ActionButton
          focusKey="bookmark-btn"
          active={bookmarked}
          onAction={handleBookmark}
        >
          <BookmarkIcon active={bookmarked} />
        </ActionButton>
      )}
      {showRate && (
        <ActionButton focusKey="like-btn" active={liked} onAction={handleLike}>
          <LikeIcon />
        </ActionButton>
      )}
      {showRate && (
        <ActionButton
          focusKey="dislike-btn"
          active={disliked}
          onAction={handleDislike}
        >
          <DislikeIcon />
        </ActionButton>
      )}
    </div>
  );
};

export default ActionButtons;
