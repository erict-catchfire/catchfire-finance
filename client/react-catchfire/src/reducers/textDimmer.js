const textDimmerReducer = (state = false, action) => {
    switch(action.type){
        case 'TOGGLE_TEXT_DIMMER':
            return ~state;
        case 'SET_TEXT_DIMMER':
            return true;
        case 'UNSET_TEXT_DIMMER':
            return false;
        default:
            return state;
    }
}
export default textDimmerReducer