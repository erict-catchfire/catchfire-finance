import React from "react";
import { removeLineObject, modifyLineObject, removeDataAtId } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dropdown, List, ListContent, Loader } from "semantic-ui-react";

export const SelectionItem = ({ id }) => {
  const dispatch = useDispatch();
  const keywords = useSelector((state) => state.keywords);
  const controlItems = useSelector((state) => state.dataLine);
  const dataItems = useSelector((state) => state.dataCollection);

  const keyWordOptions = [];

  keywords.map((keyword) => {
    keyWordOptions.push({
      key: keyword,
      text: keyword,
      value: keyword,
    });
  });

  const dataOptions = [
    { key: "joy_twitter_sentiment", text: "joy sentiment", value: "joy_twitter_sentiment" },
    { key: "fear_twitter_sentiment", text: "fear sentiment", value: "fear_twitter_sentiment" },
    { key: "anger_twitter_sentiment", text: "anger sentiment", value: "anger_twitter_sentiment" },
    { key: "sadness_twitter_sentiment", text: "sadness sentiment", value: "sadness_twitter_sentiment" },
    { key: "confident_twitter_sentiment", text: "confident sentiment", value: "confident_twitter_sentiment" },
    { key: "tentative_twitter_sentiment", text: "tentative sentiment", value: "tentative_twitter_sentiment" },
    { key: "analytical_twitter_sentiment", text: "analytical sentiment", value: "analytical_twitter_sentiment" },
    { key: "all_twitter_sentiment", text: "all sentiment", value: "all_twitter_sentiment" },
    { key: "price", text: "price", value: "price" },
    { key: "volume", text: "volume", value: "volume" },
  ];

  const colorOptions = [
    { key: "black", text: "black", value: "black" },
    { key: "red", text: "red", value: "red" },
    { key: "blue", text: "blue", value: "blue" },
    { key: "magenta", text: "magenta", value: "magenta" },
    { key: "green", text: "green", value: "green" },
    { key: "orange", text: "orange", value: "orange" },
    { key: "pink", text: "pink", value: "pink" },
    { key: "cyan", text: "cyan", value: "cyan" },
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

  const handleKeywordDropdownChange = (e, { value }) => {
    dispatch(modifyLineObject(id, "dirty", true));
    dispatch(modifyLineObject(id, "keyword", value));
  };

  const handleDataDropdownChange = (e, { value }) => {
    dispatch(modifyLineObject(id, "dirty", true));
    dispatch(modifyLineObject(id, "dataName", value));
  };

  const handleColorDropdownChange = (e, { value }) => {
    dispatch(modifyLineObject(id, "color", value));
  };

  const handlePatternDropdownChange = (e, { value }) => {
    dispatch(modifyLineObject(id, "pattern", value));
  };

  return (
    <List.Item>
      <List.Content floated="right">
        <Button
          onClick={() => {
            dispatch(removeLineObject(id));
            dispatch(removeDataAtId(id));
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
          upward
          options={keyWordOptions}
          defaultValue={defaultKeyword}
          onChange={handleKeywordDropdownChange}
        />{" "}
        , graph{" "}
        <Dropdown
          floating
          inline
          upward
          options={dataOptions}
          defaultValue={defaultData}
          onChange={handleDataDropdownChange}
        />{" "}
        with a{" "}
        <Dropdown
          floating
          inline
          upward
          options={colorOptions}
          defaultValue={defaultColor}
          onChange={handleColorDropdownChange}
        />{" "}
        line that has a{" "}
        <Dropdown
          floating
          inline
          upward
          options={patternOptions}
          defaultValue={defaultPattern}
          onChange={handlePatternDropdownChange}
        />{" "}
        pattern. {"  " + id + " "}
        <Loader active={dataItems[id] === undefined} inline size="mini" />
      </ListContent>
    </List.Item>
  );
};
