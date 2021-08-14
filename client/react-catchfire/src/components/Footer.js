import React from "react";
import { Image } from "semantic-ui-react";
import discord from "../discord.png";
import { useDispatch } from "react-redux";
import { setPage } from "../actions";

export const Footer = () => {
  const dispatch = useDispatch();

  return (
    <div className="Footer">
      <div className="FooterUpper">
        <div>
          <Image src={discord} />
        </div>
        <div>
          <div className="Title">catchfire.finance</div>
          Austin, TX <br />
          contact@catchfire.finance
        </div>
      </div>
      <div className="FooterLower">
        <div style={{ borderRight: "1px" }}>Copyright (c) catchfire.finance. All Rights Reserved.</div>
        <a className="fLink" onClick={() => dispatch(setPage("pp"))}>
          {" "}
          Privicy Policy{" "}
        </a>
        <a className="fLink" onClick={() => dispatch(setPage("tc"))}>
          {" "}
          Terms and Conditions{" "}
        </a>
      </div>
    </div>
  );
};
