import React, { useEffect } from "react";
import { useGetCategoriesQuery } from "../../services/TMDB";
import { useNavigate } from "react-router-dom";
import { Focusable } from "react-js-spatial-navigation";
import NetworkError from "../NetworkError/NetworkError";
import Loader from "../Loader/Loader";
import Category from "./category";

const Categories = () => {
  const { data, error, isFetching } = useGetCategoriesQuery({});
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);
  const keyHandler = (key) => {
    // check if keycode is the return button on the remote and the remove button on your keyboard
    if (key.keyCode === 10009 || key.keyCode === 8) {
      localStorage.removeItem("lastCatFocus");
      navigate(-1);
    }
  };
  const handleCatInterPress = (tag_id) => {
    navigate(`/morecategory/${tag_id}`);
  };

  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  return (
    <div className="cat-section">
      <h3 className="u700">مجموعه ها</h3>

      <div className="cats">
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
  );
};

export default Categories;
