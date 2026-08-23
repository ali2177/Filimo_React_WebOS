import React from "react";
import { useTranslation } from "react-i18next";
import addProfile from "../../assets/images/add-profile.svg";

/** Most profiles an account can hold; past this the card is not offered. */
export const MAX_PROFILES = 3;

/**
 * Informational "add a profile" card.
 *
 * Deliberately *not* focusable: the app has no add-profile endpoint (profiles
 * are created on the web/mobile apps), so making it reachable would give the
 * remote a dead end to land on.
 */
const AddProfileCard = () => {
  const { t } = useTranslation();

  return (
    <div className="profile-card add-profile-card">
      <div className="add-profile-circle">
        <img src={addProfile} alt="" />
      </div>
      <div className="profile-labels">
        <p className="profile-name u700">{t("profiles.addNew")}</p>
        <p className="profile-sub u700">{t("profiles.addNewHint")}</p>
      </div>
    </div>
  );
};

export default AddProfileCard;
