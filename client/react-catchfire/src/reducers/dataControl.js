import _uniqueId from "lodash/uniqueId";

const dataControlReducer = (state = {}, action) => {
  let newState = Object.assign({}, state);
  let newItem = {};

  switch (action.type) {
    case "ADD_EMPTY_LINE_OBJECT":
      newItem = {
        keyword: null,
        dataName: "happy_twitter_sentiment",
        color: "red",
        pattern: "solid",
        type: "line",
        dirty: false,
      };

      newState[_uniqueId()] = newItem;

      return newState;
    case "ADD_LINE_OBJECT_KEYWORD":
      newItem = {
        keyword: action.payload,
        dataName: "happy_twitter_sentiment",
        color: "red",
        pattern: "solid",
        type: "line",
        dirty: false,
      };

      newState[_uniqueId()] = newItem;

      return newState;
    case "REMOVE_OBJECT_KEYWORD":
      Object.keys(state).forEach((key) => {
        if (state[key].keyword === action.payload) {
          delete newState[key];
        }
      });
      return newState;
    case "MODIFY_OBJECT":
      newState[action.id][action.field] = action.value;
      return newState;
    case "REMOVE_OBJECT":
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};
export default dataControlReducer;
