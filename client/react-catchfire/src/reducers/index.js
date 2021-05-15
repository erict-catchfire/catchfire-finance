import { combineReducers } from "redux";
import keywordReducer from "./keyword";
import dataTableReducer from "./dataTable";
import dataLineReducer from "./dataLine";
import tableDimmerReducer from "./tableDimmer";
import chartDimmerReducer from "./chartDimmer";
import textDimmerReducer from "./textDimmer";
import dataCollectionReducer from "./dataCollection";
import dataTextReducer from "./dataText";
import textCollectionReducer from "./textCollection";
import lineGraphReducer from "./lineGraph";
import pageReducer from "./page";

const allReducers = combineReducers({
  keywords: keywordReducer,
  dataTable: dataTableReducer,
  tableDimmer: tableDimmerReducer,
  textDimmer: textDimmerReducer,
  chartDimmer: chartDimmerReducer,
  dataLine: dataLineReducer,
  dataCollection: dataCollectionReducer,
  dataText: dataTextReducer,
  textCollection: textCollectionReducer,
  lineGraph: lineGraphReducer,
  page: pageReducer,
});

export default allReducers;
