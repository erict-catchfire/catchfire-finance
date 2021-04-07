//import React, { useEffect, useState } from 'react';
import React from "react";
import { useSelector } from "react-redux";
import { DataTable } from "./DataTable";
import { LineGraph } from "./LineGraph/LineGraph";

// const GetPriceData = tickers => {
//     const [data, setData] = useState([]);

//     console.log("GET PRICE")
//     useEffect(() => {
//         if (tickers.length !== 0 ) {
//             const request = {
//                 "tickers" : tickers
//             }

//             fetch("/getPrice", {
//                 method : "POST",
//                 headers : {
//                     "Content-Type" : "application/json"
//                 },
//                 body: JSON.stringify(request)
//             }).then(response => {
//                 response.json().then(data => {
//                     setData(data)
//                 });
//             });
//         }
//     }, [tickers]);

//     return data;
// }

export const VizGrid = () => {
  const keywords = useSelector((state) => state.keywords);

  // const data = GetPriceData(keywords);

  return (
    <div className="VizGrid">
      <div className="viz_wide">
        <LineGraph />
      </div>
      <div className="viz_wide">
        <DataTable />
      </div>
      <div className="viz_wide">
        <div>Viz1</div>
        <div>
          {keywords.map((ticker) => {
            return (
              <div key={ticker}>
                <div> {ticker} </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="Viz2">
        <div>Viz2</div>
        <div>{keywords}</div>
      </div>
      <div className="Viz3">
        <div>Viz3</div>
        <div>{keywords}</div>
      </div>
      <div className="Viz4">
        <div>Viz4</div>
        <div>{keywords}</div>
      </div>
    </div>
  );
};
