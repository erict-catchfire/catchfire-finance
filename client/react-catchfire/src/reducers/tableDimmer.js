const tableDimmerReducer = (state = false, action) => {
    switch(action.type){
        case 'TOGGLE_TABLE_DIMMER':
            return ~state;
        case 'SET_TABLE_DIMMER':
            return true;
        case 'UNSET_TABLE_DIMMER':
            return false;
        default:
            return state;
    }
}
export default tableDimmerReducer