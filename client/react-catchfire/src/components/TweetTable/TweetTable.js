import React, { useEffect } from "react";
import { TweetPanel } from "./TweetPanel";
import { TweetControl } from "./TweetControl";
import { InfoBar } from "../InfoBar";
import { useSelector, useDispatch } from "react-redux";
import { addTextAtId, modifyTextObject, toggleTextDimmer } from "../../actions";
import { Dimmer } from "semantic-ui-react";

import _ from "lodash";

const randomDate = (start, end, startHour, endHour) => {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
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
        console.log(
          "GET DATA FOR : ",
          controlItems[element].keyword,
          controlItems[element].dataName
        );

        const data = [
          {
            text: "RANDOMSKJSIJ",
            date: randomDate(new Date(2020, 0, 1), new Date(2021, 0, 1), 0, 0),
            sent: Math.random(),
            anger: Math.random(),
            user: "@taytay",
          },
          {
            text: "TWEEEET2",
            date: randomDate(new Date(2020, 0, 1), new Date(2021, 0, 1), 0, 0),
            sent: Math.random(),
            anger: Math.random(),
            user: "@taytay",
          },
        ];
        dispatch(addTextAtId(element, data));
        dispatch(modifyTextObject(element, "dirty", false));
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
