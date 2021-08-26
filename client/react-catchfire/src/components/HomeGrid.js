//import React, { useEffect, useState } from 'react';
import React from "react";
import { useSelector } from "react-redux";
import { WordCloud } from "./WordCloud/WordCloud";
import { TreeMap } from "./TreeMap/TreeMap";

export const HomeGrid = () => {
  const page = useSelector((state) => state.page);

  return (
    <div className={page === "home" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>
      <div className="viz_wide">
        <WordCloud />
      </div>
      <div className="viz_wide">
        <TreeMap />
      </div>
    </div>
  );
};
