import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "semantic-ui-react";
import {
  setStartEndLineGraph,
} from "../../actions/index";

export const TimePeriodSelect = () => {
  const [state, setState] = useState("All");
  const lineGraphControl = useSelector((state) => state.lineGraph);
  const dispatch = useDispatch();

  const handleChange = (e, { value }) => {
    setState(value);
    let newDate = new Date(lineGraphControl.end.getTime());

    switch (value) {
      case "30":
        newDate.setDate(newDate.getDate() - 30);
        dispatch(setStartEndLineGraph(newDate, lineGraphControl.end));
        break;
      case "90":
        newDate.setDate(newDate.getDate() - 90);
        dispatch(setStartEndLineGraph(newDate, lineGraphControl.end));
        break;
      default:
        dispatch(
          setStartEndLineGraph(lineGraphControl.min, lineGraphControl.max)
        );
    }
  };

  return (
    <div
      className="TimePeriodSelect"
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <Form>
        <Form.Group inline>
          <Form.Checkbox
            label="All"
            name="radioGroup"
            value={"All"}
            checked={state === "All"}
            onChange={handleChange}
          />
          <Form.Checkbox
            label="60 Days"
            name="radioGroup"
            value={"90"}
            checked={state === "90"}
            onChange={handleChange}
          />
          <Form.Checkbox
            label="30 Days"
            name="radioGroup"
            value={"30"}
            checked={state === "30"}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
    </div>
  );
};
