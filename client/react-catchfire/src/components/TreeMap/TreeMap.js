import React from "react";
import { InfoBar } from "../InfoBar";
import { toggleTreeMapDimmer } from "../../actions";
import { TreeMapPanel } from "./TreeMapPanel";
import { Dimmer } from "semantic-ui-react";
import { useSelector } from "react-redux";

export const TreeMap = () => {
  const dimmerState = useSelector((state) => state.treemapDimmer);

  return (
    <>
      <Dimmer.Dimmable blurring dimmed={false}>
        <Dimmer active={dimmerState}>
          <div className="donationTitle">
            <h1> Tree Map </h1>
          </div>
          <div className="textBody">
            A Tree Map displaying the top tickers correlated with each emotion. The size of the square is how many
            mentions there are of that ticker with that emotion.
          </div>
          <div className="textBody">
            <br></br>
            The darkness / magnitude of each circle is determined by how heavily that word is used for that emotion. If
            it is light that word shows up equally in all emotions. If it is dark it is more exclusive for that emotion.
          </div>
        </Dimmer>
        <div className="TreeMap" style={{ paddingLeft: "5%" }}>
          <TreeMapPanel />
        </div>
      </Dimmer.Dimmable>
      <InfoBar toggleFunction={toggleTreeMapDimmer()} />
    </>
  );
};
