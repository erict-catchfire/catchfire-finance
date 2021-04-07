import React from "react";
import { GraphPanal } from "./GraphPanal";
import { ControlPanal } from "./ControlPanal";
import { InfoBar } from "../InfoBar";

export const LineGraph = () => {
  return (
    <>
      <div className="LineGraph">
        <GraphPanal />
        <ControlPanal />
      </div>
      <InfoBar />
    </>
  );
};
