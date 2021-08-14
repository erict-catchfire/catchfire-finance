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
          <div className="donationTitle">
            <h1> Word Cloud </h1>
          </div>
          <div className="textBody">
            Word cloud showing the most popular terms over the past 7 days. If you put the mouse over a circle it will
            display the emotion most connected with mentions with that word.
          </div>
          <div className="textBody">
            <br></br>
            The darkness / magnitude of each circle is determined by how heavily that word is used for that emotion. If
            it is light that word shows up equally in all emotions. If it is dark it is more exclusive for that emotion.
          </div>
        </Dimmer>
        <div className="WordCloud">
          <WordCloudPanal />
        </div>
      </Dimmer.Dimmable>
      <InfoBar toggleFunction={toggleWordCloudDimmer()} />
    </>
  );
};
