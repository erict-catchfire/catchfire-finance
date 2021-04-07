import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setKeywords,
  addLineObjectwithKeyword,
  removeLineObjectwithKeyword,
} from "../actions";

const GetTickers = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/getTickers").then((response) => {
      response.json().then((data) => {
        const toSet = [];
        for (const ticker in data) {
          toSet.push({
            key: ticker,
            content: data[ticker].longName,
            text: ticker,
            value: ticker,
            label: ticker,
          });
        }
        setData(toSet);
      });
    });
  }, []);

  return data;
};

export const Searchbar = () => {
  const dispatch = useDispatch();
  const tickers = GetTickers();
  const keywords = useSelector((state) => state.keywords);

  const onChangeSearchBar = (e, { value }) => {
    console.log(value);

    if (keywords.length < value.length) {
      dispatch(setKeywords(value));
      dispatch(addLineObjectwithKeyword(value[value.length - 1]));
    } else {
      const removedKeyword = keywords.filter(
        (keyword) => value.indexOf(keyword) === -1
      );
      dispatch(removeLineObjectwithKeyword(removedKeyword[0]));
      dispatch(setKeywords(value));
    }
  };

  return (
    <Dropdown
      placeholder="Home"
      fluid
      multiple
      search
      selection
      closeOnChange
      onChange={onChangeSearchBar}
      options={tickers}
      loading={tickers.length === 0}
      scrolling
    />
  );
};
