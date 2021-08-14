import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dimmer, Table } from "semantic-ui-react";
import { InfoBar } from "./InfoBar.js";
import { toggleTableDimmer } from "../actions";

const tableColumns = [
  "Symbol",
  "AP",
  "JP",
  "FP",
  "ANP",
  "SP",
  "CP",
  "TP",
  "ANAP",
  "AV",
  "JV",
  "FV",
  "ANV",
  "SV",
  "CV",
  "TV",
  "ANAV",
];
const tableColumnsMap = {
  Symbol: "ticker",
  AP: "ap0",
  AP1: "ap1",
  AV: "av0",
  AV1: "av1",
  JP: "jp0",
  JP1: "jp1",
  JV: "jv0",
  JV1: "jv1",
  FP: "fp0",
  FP1: "fp1",
  FV: "fv0",
  FV1: "fv1",
  ANP: "anp0",
  ANP1: "anp1",
  ANV: "anv0",
  ANV1: "anv1",
  SP: "sp0",
  SP1: "sp1",
  SV: "sv0",
  SV1: "sv1",
  CP: "cp0",
  CP1: "cp1",
  CV: "cv0",
  CV1: "cv1",
  TP: "tp0",
  TP1: "tp1",
  TV: "tv0",
  TV1: "tv1",
  ANAP: "anap0",
  ANAP1: "anap1",
  ANAV: "anav0",
  ANAV1: "anav1",
};

const GetTableData = () => {
  const tickers = useSelector((state) => state.keywords);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tickers.length !== 0) {
      const request = {
        tickers: tickers,
      };

      fetch("/getTableData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }).then((response) => {
        response.json().then((data) => {
          const dataKeys = Object.keys(data);

          // Get Table in Cleaner Format for Sorting and Table Creation
          const tableData = [];
          dataKeys.map((ticker) =>
            tableData.push({
              ticker: ticker,
              longname: data[ticker][0],
              sector: data[ticker][1],
              ap0: data[ticker][2],
              ap1: data[ticker][3],
              av0: data[ticker][4],
              av1: data[ticker][5],
              jp0: data[ticker][6],
              jp1: data[ticker][7],
              jv0: data[ticker][8],
              jv1: data[ticker][9],
              fp0: data[ticker][10],
              fp1: data[ticker][11],
              fv0: data[ticker][12],
              fv1: data[ticker][13],
              anp0: data[ticker][14],
              anp1: data[ticker][15],
              anv0: data[ticker][16],
              anv1: data[ticker][17],
              sp0: data[ticker][18],
              sp1: data[ticker][19],
              sv0: data[ticker][20],
              sv1: data[ticker][21],
              cp0: data[ticker][22],
              cp1: data[ticker][23],
              cv0: data[ticker][24],
              cv1: data[ticker][25],
              tp0: data[ticker][26],
              tp1: data[ticker][27],
              tv0: data[ticker][28],
              tv1: data[ticker][29],
              anap0: data[ticker][30],
              anap1: data[ticker][31],
              anav0: data[ticker][32],
              anav1: data[ticker][33],
            })
          );

          dispatch({ type: "SET_DATA", payload: tableData });
        });
      });
    }
  }, [tickers, dispatch]);
};

export const DataTable = () => {
  const dispatch = useDispatch();

  const round2 = (x) => Math.round(x * 100) / 100;

  // Grab Table Data
  GetTableData();

  // Grab state
  const { column, data, direction } = useSelector((state) => state.dataTable);
  const dimmerState = useSelector((state) => state.tableDimmer);

  return (
    <div className="DataTable">
      <Dimmer.Dimmable blurring dimmed={dimmerState}>
        <Dimmer active={dimmerState}>
          <div className="donationTitle">
            <h2> Correlation Table </h2>
          </div>
          <div className="textBody">
            This table shows the r-value and two-tailed p-test values between each emotion and price/volume. (Pearson
            Correlation). Top value is the r-value and the bottom value is the p-value.
          </div>
          <div className="textBody">
            <br></br>
            A: Anger, J: Joy, F: Fear, AN: Analytical, S: Sad, C: Confident, T: Tentative, ANA: Analytical
            <br></br>
          </div>
        </Dimmer>
        <div className="SemanticTable">
          <Table compact="very" size="small" sortable={true}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={1}> </Table.HeaderCell>
                <Table.HeaderCell colSpan={8}> Price Correlation </Table.HeaderCell>
                <Table.HeaderCell colSpan={8}> Volume Correlation </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                {tableColumns.map((col) => (
                  <Table.HeaderCell
                    key={col}
                    colSpan={1}
                    sorted={column === tableColumnsMap[col] ? direction : null}
                    onClick={() =>
                      dispatch({
                        type: "CHANGE_SORT",
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
              {data.map(
                ({
                  ticker,
                  sector,
                  ap0,
                  av0,
                  jp0,
                  jv0,
                  fp0,
                  fv0,
                  anp0,
                  anv0,
                  sp0,
                  sv0,
                  cp0,
                  cv0,
                  tp0,
                  tv0,
                  anap0,
                  anav0,
                  ap1,
                  av1,
                  jp1,
                  jv1,
                  fp1,
                  fv1,
                  anp1,
                  anv1,
                  sp1,
                  sv1,
                  cp1,
                  cv1,
                  tp1,
                  tv1,
                  anap1,
                  anav1,
                }) => (
                  <Table.Row key={ticker}>
                    <Table.Cell> {ticker} </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(ap0)} <br /> {round2(ap1)}{" "}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(jp0)} <br /> {round2(jp1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(fp0)} <br /> {round2(fp1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(anp0)} <br /> {round2(anp1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(sp0)} <br /> {round2(sp1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(cp0)} <br /> {round2(cp1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(tp0)} <br /> {round2(tp1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(anap0)} <br /> {round2(anap1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(av0)} <br /> {round2(av1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(jv0)} <br /> {round2(jv1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(fv0)} <br /> {round2(fv1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(anv0)} <br /> {round2(anv1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(sv0)} <br /> {round2(sv1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(cv0)} <br /> {round2(cv1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(tv0)} <br /> {round2(tv1)}
                    </Table.Cell>
                    <Table.Cell>
                      {" "}
                      {round2(anav0)} <br /> {round2(anav1)}
                    </Table.Cell>
                  </Table.Row>
                )
              )}
            </Table.Body>
          </Table>
        </div>
      </Dimmer.Dimmable>
      <InfoBar toggleFunction={toggleTableDimmer()} />
    </div>
  );
};
