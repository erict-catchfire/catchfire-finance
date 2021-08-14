import React from "react";
import { Searchbar } from "./Searchbar";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../actions";
import { Button } from "semantic-ui-react";
import logo from "../logo.png";

export const Header = ({ logoWidth, logoHeight }) => {
  const dispatch = useDispatch();

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
    <div className="Header">
      <div style={{ paddingTop: "1.5%" }}>
        <img className="img-responsive" src={logo} alt="logo" />
      </div>
      <div className="Searchbar">
        <Searchbar />
      </div>
      <div className="HeaderLinks">
        <Button size="small" color="gray" onClick={() => dispatch(setPage("home"))}>
          Home
        </Button>
        <Button size="small" color="gray" onClick={() => dispatch(setPage("viz"))}>
          Ticker
        </Button>
        <Button size="small" color="gray" onClick={() => dispatch(setPage("about"))}>
          About
        </Button>
        <Button size="small" color="gray" onClick={() => dispatch(setPage("donation"))}>
          Donation
        </Button>
        <Button circular size="mini" active="true" color="gray" icon="discord" onClick={() => openInNewTab('https://discord.gg/KJsyjDpJSr')}/>
        <Button circular size="mini" active="true" color="gray" icon="twitter" onClick={() => openInNewTab('https://twitter.com/catchfirefi')}/>
        <Button circular size="mini" active="true" color="gray" icon="patreon" onClick={() => openInNewTab('https://www.patreon.com/catchfirefinance')}/>
      </div>
    </div>
  );
};
