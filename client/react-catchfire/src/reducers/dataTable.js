import _ from 'lodash'

const dataTableReducer = (state = {
    column : null,
    data : [],
    direction: null
}, action
) => {
    switch (action.type) {
        case 'SET_DATA':
            return {
                column: state.data,
                data: action.payload,
                direction: state.data,
              }
        case 'CHANGE_SORT':
          if (state.column === action.column) {
            return {
              ...state,
              data: state.data.slice().reverse(),
              direction:
                state.direction === 'ascending' ? 'descending' : 'ascending',
            }
          }
    
          return {
            column: action.column,
            data: _.sortBy(state.data, [action.column]),
            direction: 'ascending',
          }
        default:
            return state
      }
}
export default dataTableReducer