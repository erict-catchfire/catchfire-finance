export const setKeywords = (keywords) => {
  return {
    type: "SET",
    payload: keywords,
  };
};

export const toggleTableDimmer = () => {
  return {
    type: "TOGGLE_TABLE_DIMMER",
  };
};

export const unsetTableDimmer = () => {
  return {
    type: "UNSET_TABLE_DIMMER",
  };
};

export const addEmptyLineObject = (id) => {
  return {
    type: "ADD_EMPTY_LINE_OBJECT",
    payload: id,
  };
};

export const removeLineObject = (id) => {
  return {
    type: "REMOVE_LINE_OBJECT",
    payload: id,
  };
};

export const addLineObjectwithKeyword = (keyword) => {
  return {
    type: "ADD_LINE_OBJECT_KEYWORD",
    payload: keyword,
  };
};

export const removeLineObjectwithKeyword = (keyword) => {
  console.log(keyword);
  return {
    type: "REMOVE_LINE_OBJECT_KEYWORD",
    payload: keyword,
  };
};

export const modifyLineObject = (id, field, value) => {
  return {
    type: "MODIFY_LINE_OBJECT",
    id: id,
    field: field,
    value: value,
  };
};

export const addDataAtId = (id, data) => {
  return {
    type: "ADD_LINE_DATA_AT_ID",
    id: id,
    payload: data,
  };
};

export const removeDataAtId = (id) => {
  console.log(id)
  return {
    type: "REMOVE_LINE_DATA_AT_ID",
    id: id,
  };
};

export const setStartEndLineGraph = (start , end) => {
  console.log("set start end")
  return {
    type: "SET_START_END_LINE_GRAPH",
    start: start,
    end: end
  };
};

export const setDataMinMaxLineGraph = (min , max) => {
  return {
    type: "SET_MIN_MAX_LINE_GRAPH",
    min: min,
    max: max
  };
};
