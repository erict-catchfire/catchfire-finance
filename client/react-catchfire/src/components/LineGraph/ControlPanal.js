import React from "react";
import { addEmptyLineObject, removeLineObject, modifyLineObject } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dropdown, List, ListContent, Loader } from "semantic-ui-react";

const SelectionItem = ({ id }) => {
  const dispatch = useDispatch();
  const keywords = useSelector((state) => state.keywords);
  const controlItems = useSelector((state) => state.dataLine);

  const keyWordOptions = [];

  keywords.map((keyword) => {
    keyWordOptions.push({
      key: keyword,
      text: keyword,
      value: keyword,
    });
  });

  const dataOptions = [
    { key: "ats", text: "all twitter sentiment", value: "ats" },
    { key: "ants", text: "angry twitter sentiment", value: "ants" },
    { key: "gts", text: "good twitter sentiment", value: "gts" },
    { key: "pri", text: "price", value: "pri" },
    { key: "vol", text: "volume", value: "vol" },
  ];

  const colorOptions = [
    { key: "black", text: "black", value: "black" },
    { key: "white", text: "white", value: "white" },
    { key: "red", text: "red", value: "red" },
    { key: "blue", text: "blue", value: "blue" },
    { key: "green", text: "green", value: "green" },
    { key: "magenta", text: "magenta", value: "magenta" },
  ];

  const patternOptions = [
    { key: "solid", text: "solid", value: "solid" },
    { key: "dashed", text: "dashed", value: "dashed" },
    { key: "dotted", text: "dotted", value: "dotted" },
  ];

  const defaultKeyword = controlItems[id].keyword;
  const defaultData = controlItems[id].dataName;
  const defaultColor = controlItems[id].color;
  const defaultPattern = controlItems[id].pattern;

  const handleKeywordDropdownChange = (e, {value}) => {
    dispatch(modifyLineObject(id , "keyword", value))
  }

  const handleDataDropdownChange = (e, {value}) => {
    dispatch(modifyLineObject(id , "dataName", value))
  }

  const handleColorDropdownChange = (e, {value}) => {
    dispatch(modifyLineObject(id , "color", value))
  }

  const handlePatternDropdownChange = (e, {value}) => {
    dispatch(modifyLineObject(id , "pattern", value))
  }

  return (
    <List.Item>
      <List.Content floated="right">
        <Button onClick={() => dispatch(removeLineObject(id))}>-</Button>
      </List.Content>
      <ListContent floated="left">
        For{" "}
        <Dropdown
          floating
          inline
          options={keyWordOptions}
          defaultValue={defaultKeyword}
          onChange={handleKeywordDropdownChange}
        />{" "}
        , graph{" "}
        <Dropdown
          floating
          inline
          options={dataOptions}
          defaultValue={defaultData}
          onChange={handleDataDropdownChange}
        />{" "}
        with a{" "}
        <Dropdown
          floating
          inline
          options={colorOptions}
          defaultValue={defaultColor}
          onChange={handleColorDropdownChange}
        />{" "}
        line that has a{" "}
        <Dropdown
          floating
          inline
          options={patternOptions}
          defaultValue={defaultPattern}
          onChange={handlePatternDropdownChange}
        />{" "}
        pattern. {"  " + id + " "}
        <Loader active={!controlItems[id].haveData} inline size="mini" />
      </ListContent>
    </List.Item>
  );
};

export const ControlPanal = () => {
  const dispatch = useDispatch();
  const controlItems = useSelector((state) => state.dataLine);
  const controlKeys = Object.keys(controlItems);

  return (
    <div className="ControlPanal">
      <div>
        <List divided verticalAlign="middle">
          {controlKeys.map((key) => (
            <SelectionItem key={key} id={key}/>
          ))}
        </List>
      </div>
      <Button onClick={() => dispatch(addEmptyLineObject())}>+</Button>
    </div>
  );
};
