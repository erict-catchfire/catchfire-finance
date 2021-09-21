import React from "react";
import { Searchbar } from "./Searchbar";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../actions";
import { Button } from "semantic-ui-react";
import logo from "../logo.png";
import ReactGA from "react-ga";

export const Header = ({ logoWidth, logoHeight }) => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.page);

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className="Header">
      <div style={{ paddingTop: "1.5%" }}>
        <img
          className="img-responsive"
          style={{ cursor: "pointer" }}
          src={logo}
          alt="logo"
          onClick={() => {
            dispatch(setPage("home"));
            ReactGA.event({ category: "User", action: "Clicked Home" });
          }}
        />
      </div>
      <div className="Searchbar">
        <Searchbar />
      </div>
      <div className="HeaderLinks">
        <Button
          size="small"
          active={page === "home"}
          onClick={() => {
            dispatch(setPage("home"));
            ReactGA.event({ category: "User", action: "Clicked Home" });
          }}
        >
          Home
        </Button>
        <Button
          size="small"
          active={page === "viz"}
          onClick={() => {
            dispatch(setPage("viz"));
            ReactGA.event({ category: "User", action: "Clicked Viz" });
          }}
        >
          Ticker
        </Button>
        <Button
          size="small"
          active={page === "about"}
          onClick={() => {
            dispatch(setPage("about"));
            ReactGA.event({ category: "User", action: "Clicked About" });
          }}
        >
          About
        </Button>
        <Button
          size="small"
          active={page === "donation"}
          onClick={() => {
            dispatch(setPage("donation"));
            ReactGA.event({ category: "User", action: "Clicked Donation" });
          }}
        >
          Donation
        </Button>
        <Button
          circular
          size="mini"
          icon="discord"
          onClick={() => {
            openInNewTab("https://discord.gg/KJsyjDpJSr");
            ReactGA.event({ category: "User", action: "Clicked Discord" });
          }}
        />
        <Button
          circular
          size="mini"
          icon="twitter"
          onClick={() => {
            openInNewTab("https://twitter.com/catchfirefi");
            ReactGA.event({ category: "User", action: "Clicked Twitter" });
          }}
        />
        <Button
          circular
          size="mini"
          icon="patreon"
          onClick={() => {
            openInNewTab("https://www.patreon.com/catchfirefinance");
            ReactGA.event({ category: "User", action: "Clicked Patreon" });
          }}
        />
      </div>
    </div>
  );
};
