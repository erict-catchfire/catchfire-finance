import React from "react";
import { addEmptyLineObject } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { Button, List } from "semantic-ui-react";
import { SelectionItem } from "./SelectionItem";

// keyword: "",
// dataName: "ats",
// color: "red",
// pattern: "solid",
// data: {},
// haveData: false,

export const ControlPanal = () => {
  const dispatch = useDispatch();
  const controlItems = useSelector((state) => state.dataLine);
  const controlKeys = Object.keys(controlItems);

  // useEffect(() => {
  //   controlKeys.forEach(element => {
  //     if (!controlItems[element].haveData && controlItems[element].keyword !== "")
  //        console.log("GET DATA FOR : ",controlItems[element].keyword,controlItems[element].haveData)
  //        dispatch(modifyLineObject(element , "haveData", true))
  //   });
  // })

  return (
    <div className="ControlPanal">
      <div className="ListBox">
        <List divided>
          {controlKeys.map((key) => (
            <SelectionItem key={key} id={key} />
          ))}
        </List>
      </div>
      <Button className="AddButton" basic size="mini" color="orange" onClick={() => dispatch(addEmptyLineObject())}>
        Add Line
      </Button>
    </div>
  );
};
