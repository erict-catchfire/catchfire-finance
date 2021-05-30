import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "semantic-ui-react";
import _ from "lodash";

const tableColumns = ["Date", "User", "Text", "Sent", "Anger"];
const tableColumnsMap = {
  Date: "date",
  User: "user",
  Text: "text",
  Sent: "sent",
  Anger: "anger",
};

export const TweetPanel = () => {
  const dataItems = useSelector((state) => state.textCollection);
  const dataKeys = Object.keys(dataItems);
  const dispatch = useDispatch();

  const { column, data, direction } = useSelector(
    (state) => state.textCollection
  );

  const width = 1024 - 30;

  return (
    <div className="TweetPanel" class="TweetPanel">
      <Table
        striped
        role="grid"
        aria-labelledby="header"
        compact="very"
        size="small"
        sortable={true}
      >
        <Table.Header>
          <Table.Row>
            {tableColumns.map((col) => (
              <Table.HeaderCell
                key={col}
                colSpan={1}
                sorted={column === tableColumnsMap[col] ? direction : null}
                onClick={() =>
                  dispatch({
                    type: "CHANGE_TWEET_SORT",
                    column: tableColumnsMap[col],
                  })
                }
              >
                {" "}
                {col}{" "}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((data) => (
            <Table.Row key={_.uniqueId()}>
              <Table.Cell> {data.date.toString()} </Table.Cell>
              <Table.Cell> {data.user} </Table.Cell>
              <Table.Cell> {data.text} </Table.Cell>
              <Table.Cell> {data.sent} </Table.Cell>
              <Table.Cell> {data.anger} </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
