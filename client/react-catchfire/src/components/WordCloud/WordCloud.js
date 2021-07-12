import React from "react";
import { InfoBar } from "../InfoBar";
import { toggleWordCloudDimmer } from "../../actions";
import { WordCloudPanal } from "./WordCloudPanel";
import { Dimmer } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";

export const WordCloud = () => {
  const dimmerState = useSelector((state) => state.wordcloudDimmer);

  return (
    <>
      <Dimmer.Dimmable blurring dimmed={false}>
        <Dimmer active={dimmerState}>
          <div>HELP TEXT OR IMAGE</div>
        </Dimmer>
        <div className="WordCloud">
          <WordCloudPanal />
        </div>
      </Dimmer.Dimmable>
      <InfoBar toggleFunction={toggleWordCloudDimmer()} />
    </>
  );
};
