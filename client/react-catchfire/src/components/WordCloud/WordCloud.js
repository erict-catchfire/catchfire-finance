import React from "react";
import { InfoBar } from "../InfoBar";
import { toggleWordCloudDimmer } from "../../actions";
import { WordCloudPanal } from "./WordCloudPanel";
import { Dimmer } from "semantic-ui-react";

export const WordCloud = () => {
  return (
    <>
      <Dimmer.Dimmable blurring dimmed={false}>
        <Dimmer active={false}>
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
