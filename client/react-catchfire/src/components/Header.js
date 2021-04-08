import React from "react";
import { Searchbar } from "./Searchbar";

export const Header = ({ logoWidth, logoHeight }) => {
  return (
    <div className="Header">
      <div>
        <svg width={logoWidth} height={logoHeight}>
          {<rect width={logoWidth} height={logoHeight} />}
        </svg>
      </div>
      <div className="Searchbar">
        <Searchbar />
      </div>
      <div className="HeaderLinks">
        <div>Link 0</div>
        <div>Link 1</div>
        <div>Link 2</div>
        <div>Link 3</div>
      </div>
    </div>
  );
};
