import React from "react";
import { useSelector } from "react-redux";

export const DonationGrid = () => {
  const page = useSelector((state) => state.page);

  return (
    <div className={page == "donation" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>
      <div className="viz_wide">
        DONATION
      </div>
      <div className="viz_wide">
        DONATION
      </div>
    </div>
  );
};
