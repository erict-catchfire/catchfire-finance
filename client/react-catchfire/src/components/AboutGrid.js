//import React, { useEffect, useState } from 'react';
import React from "react";
import { useSelector } from "react-redux";

export const AboutGrid = () => {
  const page = useSelector((state) => state.page);

  return (
    <div className={page == "about" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>
      <div className="viz_wide">
        ABOUT
      </div>      
    </div>
  );
};
