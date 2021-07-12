const treemapDimmerReducer = (state = false, action) => {
    switch(action.type){
        case 'TOGGLE_TM_DIMMER':
            return ~state;
        case 'SET_TM_DIMMER':
            return true;
        case 'UNSET_TM_DIMMER':
            return false;
        default:
            return state;
    }
}
export default treemapDimmerReducer