const lineGraphReducer = (
  state = {
    valid: false,
    start: new Date(0, 0, 0),
    end: new Date(0, 0, 0),
    min: new Date(0, 0, 0),
    max: new Date(0, 0, 0)
  },
  action
) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case "SET_START_END_LINE_GRAPH":
      newState.valid = true;
      newState.start = action.start;
      newState.end = action.end;
      return newState;
    case  "SET_MIN_MAX_LINE_GRAPH":
      newState.min = action.min;
      newState.max = action.max;
      return newState;
    default:
      return state;
  }
};
export default lineGraphReducer;
