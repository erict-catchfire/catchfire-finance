import {combineReducers} from 'redux';
import keywordReducer from './keyword';
import dataTableReducer from './dataTable';

const allReducers = combineReducers({
    keywords : keywordReducer,
    dataTable : dataTableReducer
})

export default allReducers