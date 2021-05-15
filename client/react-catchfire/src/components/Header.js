import React from "react";
import { Searchbar } from "./Searchbar";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../actions";
import { Button } from "semantic-ui-react";

export const Header = ({ logoWidth, logoHeight }) => {
  const dispatch = useDispatch();

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
        <Button size="mini" onClick={() => dispatch(setPage("home"))}>
          Home
        </Button>
        <Button size="mini" onClick={() => dispatch(setPage("viz"))}>
          Viz.
        </Button>
        <Button size="mini" onClick={() => dispatch(setPage("about"))}>
          About
        </Button>
        <Button size="mini" onClick={() => dispatch(setPage("donation"))}>
          Donation
        </Button>
      </div>
    </div>
  );
};
