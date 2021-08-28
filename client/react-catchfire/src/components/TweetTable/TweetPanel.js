import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "semantic-ui-react";
import _ from "lodash";

const tableColumns = [
  "Date",
  "Ticker",
  "Joy",
  "Fear",
  "Anger",
  "Sadness",
  "Confident",
  "Tentative",
  "Analytical",
  "Total",
];
const tableColumnsMap = {
  Date: "date",
  Ticker: "ticker",
  Joy: "joy",
  Sent: "fear",
  Anger: "anger",
  Sadness: "sadness",
  Confident: "confident",
  Tentative: "tentative",
  Analytical: "analytical",
  Total: "total",
};

export const TweetPanel = () => {
  const dataItems = useSelector((state) => state.textCollection);
  //const dataKeys = Object.keys(dataItems);
  const dispatch = useDispatch();

  const { column, data, direction } = useSelector((state) => state.textCollection);

  //const width = 1024 - 30;

  return (
    <div className="TweetPanel">
      <Table striped role="grid" aria-labelledby="header" compact="very" size="small" sortable={true}>
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
              <Table.Cell> {data.date.toDateString()} </Table.Cell>
              <Table.Cell> {data.ticker} </Table.Cell>
              <Table.Cell> {data.joy} </Table.Cell>
              <Table.Cell> {data.fear} </Table.Cell>
              <Table.Cell> {data.anger} </Table.Cell>
              <Table.Cell> {data.sadness} </Table.Cell>
              <Table.Cell> {data.confident} </Table.Cell>
              <Table.Cell> {data.tentative} </Table.Cell>
              <Table.Cell> {data.analytical} </Table.Cell>
              <Table.Cell> {data.total} </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
