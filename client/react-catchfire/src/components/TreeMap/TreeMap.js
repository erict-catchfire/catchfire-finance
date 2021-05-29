import React from "react";
import { InfoBar } from "../InfoBar";
import { toggleTreeMapDimmer } from "../../actions";
import { TreeMapPanel } from "./TreeMapPanel";
import { Dimmer } from "semantic-ui-react";

export const TreeMap = () => {
  return (
    <>
      <Dimmer.Dimmable blurring dimmed={false}>
        <Dimmer active={false}>
          <div>HELP TEXT OR IMAGE</div>
        </Dimmer>
        <div className="TreeMap" style={{ paddingLeft: "5%" }}>
          <TreeMapPanel />
        </div>
      </Dimmer.Dimmable>
      <InfoBar toggleFunction={toggleTreeMapDimmer()} />
    </>
  );
};
