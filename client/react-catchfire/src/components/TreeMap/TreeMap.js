import React from "react";
import { InfoBar } from "../InfoBar";
import { toggleTreeMapDimmer } from "../../actions";
import { TreeMapPanel } from "./TreeMapPanel";
import { Dimmer } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";

export const TreeMap = () => {
  const dimmerState = useSelector((state) => state.treemapDimmer);

  return (
    <>
      <Dimmer.Dimmable blurring dimmed={false}>
        <Dimmer active={dimmerState}>
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
