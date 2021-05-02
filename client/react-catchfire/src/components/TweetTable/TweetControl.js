import React from "react";
import { addEmptyTextObject } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { Button, List } from "semantic-ui-react";
import { SelectionItem } from "./SelectionItem";

export const TweetControl = () => {
  const dispatch = useDispatch();
  const controlItems = useSelector((state) => state.dataText);
  const controlKeys = Object.keys(controlItems);

  return (
    <div className="ControlPanal">
      <div>
        <List divided verticalAlign="middle">
          {controlKeys.map((key) => (
            <SelectionItem key={key} id={key} />
          ))}
        </List>
      </div>
      <Button onClick={() => dispatch(addEmptyTextObject())}>+</Button>
    </div>
  );
};
