import React from "react";
import { useSelector } from "react-redux";

export const GraphPanal = () => {
  const dataItems = useSelector((state) => state.dataCollection);
  const controlItems = useSelector((state) => state.dataLine);

  const dataKeys = Object.keys(dataItems);

  return (
    <div className="GraphPanal">
      {dataKeys.map((dataId) => {
        return controlItems[dataId] === undefined ? (
          ""
        ) : (
          <div key={dataId}>
            {dataItems[dataId] +
              " " +
              controlItems[dataId].color +
              " " +
              controlItems[dataId].keyword +
              " " +
              dataId}
          </div>
        );
      })}
    </div>
  );
};
