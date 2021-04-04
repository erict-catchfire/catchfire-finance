import {combineReducers} from 'redux';
import keywordReducer from './keyword';
import dataTableReducer from './dataTable';
import tableDimmerReducer from './tableDimmer';

const allReducers = combineReducers({
    keywords : keywordReducer,
    dataTable : dataTableReducer,
    tableDimmer : tableDimmerReducer
})

export default allReducers