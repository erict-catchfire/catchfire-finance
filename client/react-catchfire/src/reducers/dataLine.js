import _uniqueId from "lodash/uniqueId";

const dataLineReducer = (state = {}, action) => {
  let newState = Object.assign({}, state);
  let newItem = {};

  switch (action.type) {
    case "ADD_EMPTY_LINE_OBJECT":
      newItem = {
        keyword: null,
        dataName: "all_twitter_sentiment",
        color: "red",
        pattern: "solid",
        dirty: false,
      };

      newState[_uniqueId()] = newItem;

      return newState;
    case "ADD_LINE_OBJECT_KEYWORD":
      newItem = {
        keyword: action.payload,
        dataName: "all_twitter_sentiment",
        color: "red",
        pattern: "solid",
        dirty: false,
      };

      newState[_uniqueId()] = newItem;

      return newState;
    case "REMOVE_LINE_OBJECT_KEYWORD":
      Object.keys(state).forEach((key) => {
        if (state[key].keyword === action.payload) {
          delete newState[key];
        }
      });
      return newState;
    case "MODIFY_LINE_OBJECT":
      // type: "MODIFY_LINE_OBJECT",
      // id: id,
      // field: field,
      // value: value
      newState[action.id][action.field] = action.value;
      return newState;
    case "REMOVE_LINE_OBJECT":
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};
export default dataLineReducer;
