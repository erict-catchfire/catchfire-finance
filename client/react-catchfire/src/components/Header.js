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
        <img className="img-responsive" src={logo} alt="logo" />
      </div>
      <div className="Searchbar">
        <Searchbar />
      </div>
      <div className="HeaderLinks">
        <Button size="small" inverted color="orange" onClick={() => dispatch(setPage("home"))}>
          Home
        </Button>
        <Button size="small" inverted color="orange" onClick={() => dispatch(setPage("viz"))}>
          Ticker
        </Button>
        <Button size="small" inverted color="orange" onClick={() => dispatch(setPage("about"))}>
          About
        </Button>
        <Button size="small" inverted color="orange" onClick={() => dispatch(setPage("donation"))}>
          Donation
        </Button>
        <Button circular size="mini" color="orange" icon="discord" />
        <Button circular size="mini" color="orange" icon="twitter" />
        <Button circular size="mini" color="orange" icon="patreon" />
      </div>
    </div>
  );
};
