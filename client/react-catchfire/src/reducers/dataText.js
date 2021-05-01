import _uniqueId from "lodash/uniqueId";

const dataTextReducer = (state = {}, action) => {
  let newState = Object.assign({}, state);
  let newItem = {};

  switch (action.type) {
    case "ADD_EMPTY_TEXT_OBJECT":
      newItem = {
        keyword: null,
        dataName: "ats",
        length: "day",
        amount: "5",
        dirty: true
      };

      newState[_uniqueId()] = newItem;

      return newState;
    case "ADD_TEXT_OBJECT_KEYWORD":
      newItem = {
        keyword: action.payload,
        dataName: "ats",
        length: "day",
        amount: "5",
        dirty: true
      };

      newState[_uniqueId()] = newItem;

      return newState;
    case "REMOVE_TEXT_OBJECT_KEYWORD":
      Object.keys(state).forEach((key) => {
        if (state[key].keyword === action.payload) {
          delete newState[key];
        }
      });
      return newState;
    case "MODIFY_TEXT_OBJECT":
      newState[action.id][action.field] = action.value;
      return newState;
    case "REMOVE_TEXT_OBJECT":
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};
export default dataTextReducer;