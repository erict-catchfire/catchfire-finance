import React, { useEffect } from "react";
import { GraphPanal } from "./GraphPanal";
import { ControlPanal } from "./ControlPanal";
import { InfoBar } from "../InfoBar";
import { useSelector, useDispatch } from "react-redux";
import { addDataAtId } from "../../actions";

export const LineGraph = () => {
  const dispatch = useDispatch();
  const controlItems = useSelector((state) => state.dataLine);
  const dataItems = useSelector((state) => state.dataCollection);
  const controlKeys = Object.keys(controlItems);

  useEffect(() => {
    controlKeys.forEach((element) => {
      if (dataItems[element] === undefined && controlItems[element].keyword) {
        console.log(
          "GET DATA FOR : ",
          controlItems[element].keyword,
          controlItems[element].dataName
        );
        const data = [0, 1, 2, 3, 4, 5, controlItems[element].dataName];
        dispatch(addDataAtId(element, data));
      }
    });
  }, [controlItems]);

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
