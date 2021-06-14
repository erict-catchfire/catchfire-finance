import React from "react";
import { Searchbar } from "./Searchbar";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../actions";
import { Button } from "semantic-ui-react";
import logo from "../logo.png";

export const Header = ({ logoWidth, logoHeight }) => {
  const dispatch = useDispatch();

  return (
    <div className="Header">
      <div style={{ paddingTop: "1.5%" }}>
        <img className="img-responsive" src={logo} alt="logo"/>
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
