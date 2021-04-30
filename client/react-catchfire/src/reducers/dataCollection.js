const dataCollectionReducer = (state = {}, action) => {
  let newState = Object.assign({}, state);

  switch (action.type) {
    case "ADD_LINE_DATA_AT_ID":
      newState[action.id] = action.payload;
      newState[action.id]["id"] = action.id;
      return newState;
    case "REMOVE_LINE_DATA_AT_ID":
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
};
export default dataCollectionReducer;
