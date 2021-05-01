//import React, { useEffect, useState } from 'react';
import React from "react";
import { useSelector } from "react-redux";
import { DataTable } from "./DataTable";
import { LineGraph } from "./LineGraph/LineGraph";
import { TweetTable } from "./TweetTable/TweetTable";

export const VizGrid = () => {
  const keywords = useSelector((state) => state.keywords);

  return (
    <div className="VizGrid">
      <div className="viz_wide">
        <LineGraph />
      </div>
      <div className="viz_wide">
        <TweetTable />
      </div>
      <div className="viz_wide">
        <DataTable />
      </div>
    </div>
  );
};
