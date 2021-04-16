import React, { useEffect } from "react";
import { GraphPanal } from "./GraphPanal";
import { ControlPanal } from "./ControlPanal";
import { InfoBar } from "../InfoBar";
import { useSelector, useDispatch } from "react-redux";
import { addDataAtId } from "../../actions";
import _ from "lodash";

const randomDate = (start, end, startHour, endHour) => {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
};

const randomTimeSeries = (maxValue, nEntries, start, end) => {
  let data = [];

  for (let i = 0; i < nEntries; i++) {
    data.push({
      data: Math.random() * maxValue,
      time: randomDate(start, end, 0, 24),
    });
  }

  let newData = _.sortBy(data, (d) => d.time);

  return newData;
};

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
        //const data = [0, 1, 2, 3, 4, 5, controlItems[element].dataName];
        const data = randomTimeSeries(
          50,
          15,
          new Date(2020, 0, 1),
          new Date(2021, 0, 1)
        );
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
