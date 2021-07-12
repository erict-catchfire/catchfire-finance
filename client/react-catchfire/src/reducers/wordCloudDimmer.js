const wordcloudDimmerReducer = (state = false, action) => {
    switch(action.type){
        case 'TOGGLE_WC_DIMMER':
            return ~state;
        case 'SET_WC_DIMMER':
            return true;
        case 'UNSET_WC_DIMMER':
            return false;
        default:
            return state;
    }
}
export default wordcloudDimmerReducer