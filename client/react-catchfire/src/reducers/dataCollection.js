const dataCollectionReducer = (state = {}, action) => {
  let newState = Object.assign({}, state);

  switch (action.type) {
    case "ADD_LINE_DATA_AT_ID":
      newState[action.id] = action.payload;
      return newState;
    case "REMOVE_LINE_DATA_AT_ID":
      console.log(action.id)
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
};
export default dataCollectionReducer;
