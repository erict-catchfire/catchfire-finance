import React from "react";
import { useDispatch } from "react-redux";
import { Radio } from "semantic-ui-react";

export const InfoBar = ({ toggleFunction }) => {
  const dispatch = useDispatch();

  return (
    <div className="InfoBar">
      <div className="textDiv">Click for more explanation.</div>
      <div className="radioDiv">
        <Radio slider size='mini' onClick={() => dispatch(toggleFunction)}>
          Info
        </Radio>
      </div>
    </div>
  );
};
