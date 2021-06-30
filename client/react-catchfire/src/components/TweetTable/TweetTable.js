import React, { useEffect } from "react";
import { TweetPanel } from "./TweetPanel";
import { TweetControl } from "./TweetControl";
import { InfoBar } from "../InfoBar";
import { useSelector, useDispatch } from "react-redux";
import { addTextAtId, modifyTextObject, toggleTextDimmer } from "../../actions";
import { Dimmer } from "semantic-ui-react";

import _ from "lodash";

const lengthDict = {
  week: 7,
  month: 31,
  year: 365,
};

const GetTableData = (keyword, length, sentiment, amount, dispatch, element) => {
  let to_return = [];

  fetch("/getTopDays", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticker: keyword,
      length: lengthDict[length],
      sentiment: sentiment,
      amount: amount,
    }),
  }).then((response) => {
    response.json().then((return_data) => {
      for (const d of return_data) {
        to_return.push({
          ticker: keyword,
          analytical: d.analytical,
          anger: d.anger,
          confident: d.confident,
          date: new Date(d.date),
          fear: d.fear,
          joy: d.joy,
          none: d.none,
          sadness: d.sadness,
          tentative: d.tentative,
          total: d.analytical + d.anger + d.confident + d.fear + d.joy + d.none + d.sadness + d.tentative,
        });
      }

      dispatch(addTextAtId(element, to_return));
      dispatch(modifyTextObject(element, "dirty", false));
    });
  });

  return to_return;
};

export const TweetTable = () => {
  const dispatch = useDispatch();
  const controlItems = useSelector((state) => state.dataText);
  const dataItems = useSelector((state) => state.textCollection);
  const controlKeys = Object.keys(controlItems);
  const dimmerState = useSelector((state) => state.textDimmer);

  useEffect(() => {
    controlKeys.forEach((element) => {
      if (controlItems[element].dirty && controlItems[element].keyword) {
        const data = GetTableData(
          controlItems[element].keyword,
          controlItems[element].length,
          controlItems[element].dataName,
          controlItems[element].amount,
          dispatch,
          element
        );
      }
    });
  }, [controlItems]);

  return (
    <>
      <Dimmer.Dimmable blurring dimmed={dimmerState}>
        <Dimmer active={dimmerState}>
          <div>HELP TEXT OR IMAGE</div>
        </Dimmer>
        <div className="TweetTable">
          <TweetPanel />
          <TweetControl />
        </div>
      </Dimmer.Dimmable>
      <InfoBar toggleFunction={toggleTextDimmer()} />
    </>
  );
};
