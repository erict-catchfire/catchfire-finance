import React from "react";
import {
  removeTextObject,
  modifyTextObject,
  removeTextAtId,
} from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dropdown, List, ListContent, Loader } from "semantic-ui-react";

export const SelectionItem = ({ id }) => {
  const dispatch = useDispatch();
  const keywords = useSelector((state) => state.keywords);
  const controlItems = useSelector((state) => state.dataText);
  const dataItems = useSelector((state) => state.textCollection);

  const keyWordOptions = [];

  keywords.map((keyword) => {
    keyWordOptions.push({
      key: keyword,
      text: keyword,
      value: keyword,
    });
  });

  const dataOptions = [
    { key: "rts", text: "random twitter sentiment", value: "ats" },
    { key: "ants", text: "top angry twitter sentiment", value: "ants" },
    { key: "gts", text: "top good twitter sentiment", value: "gts" },
  ];

  const lengthOptions = [
    { key: "day", text: "day", value: "day" },
    { key: "month", text: "month", value: "month" },
    { key: "year", text: "year", value: "year" },
  ];

  const amountOptions = [
    { key: "5", text: "5", value: "5" },
    { key: "10", text: "10", value: "10" },
    { key: "15", text: "15", value: "15" },
  ];

  const defaultData = controlItems[id].dataName;
  const defaultKeyword = controlItems[id].keyword;
  const defaultLength = controlItems[id].length;
  const defaultAmount = controlItems[id].amount;

  const handleKeywordDropdownChange = (e, { value }) => {
    dispatch(modifyTextObject(id, "dirty", true));
    dispatch(modifyTextObject(id, "keyword", value));
  };

  const handleDataDropdownChange = (e, { value }) => {
    dispatch(modifyTextObject(id, "dirty", true));
    dispatch(modifyTextObject(id, "dataName", value));
  };

  const handleLengthDropdownChange = (e, { value }) => {
    dispatch(modifyTextObject(id, "length", value));
  };

  const handleAmountDropdownChange = (e, { value }) => {
    dispatch(modifyTextObject(id, "amount", value));
  };

  return (
    <List.Item>
      <List.Content floated="right">
        <Button
          onClick={() => {
            dispatch(removeTextObject(id));
            dispatch(removeTextAtId(id));
          }}
        >
          -
        </Button>
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
        , display tweets with{" "}
        <Dropdown
          floating
          inline
          options={dataOptions}
          defaultValue={defaultData}
          onChange={handleDataDropdownChange}
        />{" "}
        from the past{" "}
        <Dropdown
          floating
          inline
          options={lengthOptions}
          defaultValue={defaultLength}
          onChange={handleLengthDropdownChange}
        />{" "}
        . Include the top{" "}
        <Dropdown
          floating
          inline
          options={amountOptions}
          defaultValue={defaultAmount}
          onChange={handleAmountDropdownChange}
        />{" "}
        ID {"  " + id + " "}
        <Loader active={controlItems[id] === undefined} inline size="mini" />
      </ListContent>
    </List.Item>
  );
};
