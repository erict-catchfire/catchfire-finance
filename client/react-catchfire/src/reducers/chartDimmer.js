const chartDimmerReducer = (state = false, action) => {
    switch(action.type){
        case 'TOGGLE_CHART_DIMMER':
            return ~state;
        case 'SET_CHART_DIMMER':
            return true;
        case 'UNSET_CHART_DIMMER':
            return false;
        default:
            return state;
    }
}
export default chartDimmerReducer