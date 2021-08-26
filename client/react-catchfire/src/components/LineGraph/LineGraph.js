import React, { useEffect } from "react";
import { GraphPanal } from "./GraphPanal";
import { ControlPanal } from "./ControlPanal";
import { InfoBar } from "../InfoBar";
import { useSelector, useDispatch } from "react-redux";
import { addDataAtId, modifyLineObject, toggleChartDimmer } from "../../actions";
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
      length: 365,
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
      length: 365,
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
      length: 365,
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
        //console.log("GET DATA FOR : ", controlItems[element].keyword, controlItems[element].dataName);

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
          default:
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
          <div className="donationTitle">
            <h1> Line Graph </h1>
          </div>
          <h3> Graph Panel </h3>
          <div className="textBody">
            The top of this component shows the selected data items from the control panel below.
          </div>
          <h3> Control Panel </h3>
          <div className="textBody">
            The bottom half contains the control panal which consists of data items to display on the graph. For each
            data item you can select which ticker you want to see data for, the type of data for that ticker, the color
            of the line, and the shape of that line. You can add and remove data items through the buttons to the right
            and bottom.
          </div>
          <div className="textBody">
            <br></br>
            You can only select to show data from tickers in the search bar above.
          </div>
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
