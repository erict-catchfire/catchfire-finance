import { combineReducers } from "redux";
import keywordReducer from "./keyword";
import dataTableReducer from "./dataTable";
import dataLineReducer from "./dataLine";
import tableDimmerReducer from "./tableDimmer";
import dataCollectionReducer from "./dataCollection";

const allReducers = combineReducers({
  keywords: keywordReducer,
  dataTable: dataTableReducer,
  tableDimmer: tableDimmerReducer,
  dataLine: dataLineReducer,
  dataCollection: dataCollectionReducer,
});

export default allReducers;
