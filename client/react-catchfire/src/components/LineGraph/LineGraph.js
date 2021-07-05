import React, { useEffect, useState } from "react";
import { GraphPanal } from "./GraphPanal";
import { ControlPanal } from "./ControlPanal";
import { InfoBar } from "../InfoBar";
import { useSelector, useDispatch } from "react-redux";
import { addDataAtId, modifyLineObject, toggleChartDimmer } from "../../actions";
import _ from "lodash";
import { Dimmer } from "semantic-ui-react";

const GetSentimentData = (keyword, sentiment, element, dispatch) => {
  let to_return = [];

  fetch("/getSentimentTimeSeries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticker: keyword,
      length: 75,
      sentiment: sentiment,
    }),
  }).then((response) => {
    response.json().then((return_data) => {
      for (const point of return_data) {
        to_return.push({
          data: point.amount,
          time: new Date(point.date),
          type: "axis",
        });
      }
      dispatch(addDataAtId(element, to_return));
      dispatch(modifyLineObject(element, "dirty", false));
    });
  });

  return to_return;
};

const GetPriceData = (keyword, element, dispatch) => {
  let to_return = [];

  fetch("/getPriceTimeSeries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticker: keyword,
      length: 75,
    }),
  }).then((response) => {
    response.json().then((return_data) => {
      for (const point of return_data) {
        to_return.push({
          data: point.close,
          time: new Date(point.date),
          type: "price",
        });
      }
      dispatch(addDataAtId(element, to_return));
      dispatch(modifyLineObject(element, "dirty", false));
    });
  });

  return to_return;
};

const GetVolumeData = (keyword, element, dispatch) => {
  let to_return = [];

  fetch("/getVolumeTimeSeries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticker: keyword,
      length: 75,
    }),
  }).then((response) => {
    response.json().then((return_data) => {
      for (const point of return_data) {
        to_return.push({
          data: point.volume,
          time: new Date(point.date),
          type: "volume",
        });
      }
      dispatch(addDataAtId(element, to_return));
      dispatch(modifyLineObject(element, "dirty", false));
    });
  });

  return to_return;
};

export const LineGraph = () => {
  const dispatch = useDispatch();
  const controlItems = useSelector((state) => state.dataLine);
  const dataItems = useSelector((state) => state.dataCollection);
  const controlKeys = Object.keys(controlItems);
  const dimmerState = useSelector((state) => state.chartDimmer);

  useEffect(() => {
    controlKeys.forEach((element) => {
      if ((dataItems[element] === undefined || controlItems[element].dirty) && controlItems[element].keyword) {
        console.log("GET DATA FOR : ", controlItems[element].keyword, controlItems[element].dataName);

        let data;

        switch (controlItems[element].dataName) {
          case "all_twitter_sentiment":
            data = GetSentimentData(controlItems[element].keyword, "all", element, dispatch);
            break;
          case "joy_twitter_sentiment":
            data = GetSentimentData(controlItems[element].keyword, "joy", element, dispatch);
            break;
          case "fear_twitter_sentiment":
            data = GetSentimentData(controlItems[element].keyword, "fear", element, dispatch);
            break;
          case "anger_twitter_sentiment":
            data = GetSentimentData(controlItems[element].keyword, "anger", element, dispatch);
            break;
          case "sadness_twitter_sentiment":
            data = GetSentimentData(controlItems[element].keyword, "sadness", element, dispatch);
            break;
          case "confident_twitter_sentiment":
            data = GetSentimentData(controlItems[element].keyword, "confident", element, dispatch);
            break;
          case "tentative_twitter_sentiment":
            data = GetSentimentData(controlItems[element].keyword, "tentative", element, dispatch);
            break;
          case "analytical_twitter_sentiment":
            data = GetSentimentData(controlItems[element].keyword, "analytical", element, dispatch);
            break;
          case "price":
            data = GetPriceData(controlItems[element].keyword, element, dispatch);
            break;
          case "volume":
            data = GetVolumeData(controlItems[element].keyword, element, dispatch);
            break;
        }
      }
    });
  }, [controlItems]);

  return (
    <>
      <Dimmer.Dimmable blurring dimmed={dimmerState}>
        <Dimmer active={dimmerState}>
          <div>HELP TEXT OR IMAGE</div>
        </Dimmer>
        <div className="LineGraph">
          <GraphPanal />
          <ControlPanal />
        </div>
      </Dimmer.Dimmable>
      <InfoBar toggleFunction={toggleChartDimmer()} />
    </>
  );
};
