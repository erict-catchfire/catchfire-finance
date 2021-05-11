//import React, { useEffect, useState } from 'react';
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "./DataTable";
import { LineGraph } from "./LineGraph/LineGraph";
import { TweetTable } from "./TweetTable/TweetTable";

export const VizGrid = () => {
  const page = useSelector((state) => state.page);

  return (
    <div className="VizGrid" class={page === "viz" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>
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
