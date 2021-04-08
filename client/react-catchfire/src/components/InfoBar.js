import React from "react";
import { useDispatch } from "react-redux";
import { Radio } from "semantic-ui-react";

export const InfoBar = ({ toggleFunction }) => {
  const dispatch = useDispatch();

  return (
    <div className="InfoBar">
      <div className="textDiv">Click for more explination.</div>
      <div className="radioDiv">
        <Radio toggle onClick={() => dispatch(toggleFunction)}>
          Info
        </Radio>
      </div>
    </div>
  );
};
