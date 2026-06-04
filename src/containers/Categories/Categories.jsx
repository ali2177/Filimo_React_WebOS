import React, { useEffect, useCallback } from "react";
import { useBackKey } from "@src/hooks/useBackKey";
import { useDisableKeyboardWhileLoading } from "@src/hooks/useDisableKeyboardWhileLoading";
import { clearHomeNavState } from "@src/utils/storageKeys";
import { useGetCategoriesQuery } from "../../services/TMDB";
import { useNavigate, useLocation } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import NetworkError from "@src/components/NetworkError/NetworkError";
import Loader from "@src/components/Loader/Loader";
import Category from "./category";
import { useAuth } from "@src/components/AuthProvider";
import { useOnlineStatus } from "@src/app/App";
import { uiStorage } from "@src/utils/uiStorage";

const Categories = () => {
  const { ref, focusKey, focused, focusSelf } = useFocusable({
    focusable: true,
    trackChildren: true,
    isFocusBoundary: true,
    focusBoundaryDirections: ["left", "right", "up", "down"],
  });
  const { jwt, setJwt } = useAuth();
  const { isOnline } = useOnlineStatus();
  const { data, error, isFetching } = useGetCategoriesQuery({ jwt });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    clearHomeNavState();
  }, []);

  useDisableKeyboardWhileLoading(isFetching);
  const handleBack = useCallback(() => {
    uiStorage.removeItem("lastCatFocus");
    if (location.pathname !== "/player") navigate(-1);
  }, [location.pathname, navigate]);

  useBackKey(handleBack);

  const handleCatInterPress = (tag_id) => {
    navigate(`/morecategory/${tag_id}`);
  };

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      <div
        className="cat-section"
        style={{ height: "100vh", overflowY: "auto", width: "100%" }}
      >
        <h3 className="cat-section-header u700">مجموعه ها</h3>

        <div ref={ref} className="cats" style={{ marginBottom: "4rem" }}>
          {data.data.map((catItem, index) => (
            <Category
              image={catItem.attributes.cover}
              title={catItem.attributes.title}
              focusKeey={`CAT_LIST_${index}`}
              tag_id={catItem.attributes.tag_id}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
};

export default Categories;
