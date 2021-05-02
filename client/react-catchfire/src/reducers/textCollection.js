import _ from "lodash";

const textCollectionReducer = (
  state = {
    column: "date",
    data: [],
    direction: "descending",
  },
  action
) => {
  let newState = Object.assign({}, state);

  switch (action.type) {
    case "CHANGE_TWEET_SORT":
      if (state.column === action.column) {
        return {
          ...state,
          data: state.data.slice().reverse(),
          direction:
            state.direction === "ascending" ? "descending" : "ascending",
        };
      }

      return {
        column: action.column,
        data: _.sortBy(state.data, [action.column]),
        direction: "ascending",
      };
    case "ADD_TEXT_DATA_AT_ID":
      console.log(action.id)
      console.log(action.payload)

      action.payload.forEach(element => {
        state["data"].push({
          ...element,
          id : action.id
        })
      });

      let newData = _.sortBy(state["data"]);

      if (state.direction === "descending") newData = newData.slice().reverse();

      return {
        column: state.column,
        data: _.sortBy(newData, [state.column]),
        direction: state.direction,
      };

    case "REMOVE_TEXT_DATA_AT_ID":
      const dataRemoved = [];

      for ( let i = 0; i < state.data.length; i++ ){
        if(state.data[i].id !== action.id) {
          dataRemoved.push(state.data[i]);
        }
      }

      return {
        column: state.column,
        data: dataRemoved,
        direction: state.direction,
      };
    default:
      return state;
  }
};
export default textCollectionReducer;
