import React from "react";
import { useDispatch } from "react-redux";
import { Radio, Popup } from "semantic-ui-react";

export const InfoBar = ({ toggleFunction }) => {
  const dispatch = useDispatch();

  return (
    <div className="InfoBar">
      <div className="textDiv"></div>
      <div className="radioDiv">
        <Popup
          content="Click for more explanation."
          trigger={
            <Radio slider size="mini" onClick={() => dispatch(toggleFunction)}>
              Info
            </Radio>
          }
        />
      </div>
    </div>
  );
};
