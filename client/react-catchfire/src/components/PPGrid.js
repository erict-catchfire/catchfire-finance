//import React, { useEffect, useState } from 'react';
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "./DataTable";
import { LineGraph } from "./LineGraph/LineGraph";
import { TweetTable } from "./TweetTable/TweetTable";

export const PPGrid = () => {
  const page = useSelector((state) => state.page);

  return <div className={page === "pp" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>Privcy Policy</div>;
};
