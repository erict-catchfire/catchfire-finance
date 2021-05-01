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

export const toggleTextDimmer = () => {
  return {
    type: "TOGGLE_TEXT_DIMMER",
  };
};

export const unsetTextDimmer = () => {
  return {
    type: "UNSET_TEXT_DIMMER",
  };
};

export const toggleChartDimmer = () => {
  return {
    type: "TOGGLE_CHART_DIMMER",
  };
};

export const unsetChartDimmer = () => {
  return {
    type: "UNSET_CHART_DIMMER",
  };
};

/*****************************************************/
// Line Related Functions

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
  return {
    type: "REMOVE_LINE_DATA_AT_ID",
    id: id,
  };
};

export const setStartEndLineGraph = (start, end) => {
  return {
    type: "SET_START_END_LINE_GRAPH",
    start: start,
    end: end,
  };
};

export const setDataMinMaxLineGraph = (min, max) => {
  return {
    type: "SET_MIN_MAX_LINE_GRAPH",
    min: min,
    max: max,
  };
};

/*****************************************************/
// Text Related Functions

export const addEmptyTextObject = (id) => {
  return {
    type: "ADD_EMPTY_TEXT_OBJECT",
    payload: id,
  };
};

export const addTextAtId = (id, data) => {
  return {
    type: "ADD_TEXT_DATA_AT_ID",
    id: id,
    payload: data,
  };
};

export const modifyTextObject = (id, field, value) => {
  return {
    type: "MODIFY_TEXT_OBJECT",
    id: id,
    field: field,
    value: value,
  };
};

export const removeTextAtId = (id) => {
  return {
    type: "REMOVE_TEXT_DATA_AT_ID",
    id: id,
  };
};

export const removeTextObject = (id) => {
  return {
    type: "REMOVE_TEXT_OBJECT",
    payload: id,
  };
};

export const addTextObjectwithKeyword = (keyword) => {
  return {
    type: "ADD_TEXT_OBJECT_KEYWORD",
    payload: keyword,
  };
};

export const removeTextObjectwithKeyword = (keyword) => {
  return {
    type: "REMOVE_TEXT_OBJECT_KEYWORD",
    payload: keyword,
  };
};
