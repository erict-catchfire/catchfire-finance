import { combineReducers } from "redux";
import keywordReducer from "./keyword";
import dataTableReducer from "./dataTable";
import dataLineReducer from "./dataLine";
import tableDimmerReducer from "./tableDimmer";
import dataCollectionReducer from "./dataCollection";
import lineGraphReducer from "./lineGraph";

const allReducers = combineReducers({
  keywords: keywordReducer,
  dataTable: dataTableReducer,
  tableDimmer: tableDimmerReducer,
  dataLine: dataLineReducer,
  dataCollection: dataCollectionReducer,
  lineGraph: lineGraphReducer
});

export default allReducers;
