import React, { useEffect, useState } from "react";
import { useGetUsersProfileQuery } from "../../services/TMDB";
import {
  FocusableComponentLayout,
  FocusContext,
  FocusDetails,
  KeyPressDetails,
  useFocusable,
  setFocus,
  getCurrentFocusKey,
} from "@noriginmedia/norigin-spatial-navigation";
import Loader from "../Loader/Loader";
import User from "./User";

const UsersProfile = () => {
  const { ref, focusKey, focusSelf, focused } = useFocusable();
  const [jwtToken, setJwtToken] = useState(null);
  const [jwtSub, setJwtSub] = useState(null);
  const { data, error, isFetching } = useGetUsersProfileQuery({ jwtSub });
  let jwt = localStorage.getItem("jwt");
  function decodeJwtToken(token) {
    const arrayToken = token.split(".");
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    return tokenPayload.sub;
  }

  useEffect(() => {
    if (jwt) {
      setJwtSub(decodeJwtToken(jwt));
    }

    console.log(decodeJwtToken(jwt));

    // if (jwt) {
    //   try {
    //     const decoded = jwt.decode(jwtToken);
    //     const sub = decoded.sub;
    //     console.log("Subject (sub):", sub);
    //   } catch (err) {
    //     console.error("Error decoding token:", err);
    //   }
    // }
  }, [jwt]);
  if (error) return <NetworkError />;

  if (isFetching) return <Loader />;

  if (!data.data) return <NetworkError />;

  return (
    <FocusContext.Provider value={focusKey}>
      <main className="users-prfile">
        <div className="users-prfile-content">
          <p className="users-prfile-content-header u700">
            چه کسی تماشا می کند ؟
          </p>
          <div className="users-prfile-wrraper">
            {data?.data.map((user) => (
              <User jwtSub={jwtSub} user={user} />
            ))}
          </div>
        </div>
      </main>
    </FocusContext.Provider>
  );
};

export default UsersProfile;
