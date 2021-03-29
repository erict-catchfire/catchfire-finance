import {combineReducers} from 'redux';
import keywordReducer from './keyword';

const allReducers = combineReducers({
    keywords : keywordReducer
})

export default allReducers