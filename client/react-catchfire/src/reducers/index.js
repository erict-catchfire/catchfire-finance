import { combineReducers } from "redux";
import keywordReducer from "./keyword";
import dataTableReducer from "./dataTable";
import dataLineReducer from "./dataLine";
import tableDimmerReducer from "./tableDimmer";

const allReducers = combineReducers({
  keywords: keywordReducer,
  dataTable: dataTableReducer,
  tableDimmer: tableDimmerReducer,
  dataLine: dataLineReducer,
});

export default allReducers;
