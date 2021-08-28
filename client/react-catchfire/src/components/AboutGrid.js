//import React, { useEffect, useState } from 'react';
import React from "react";
import { useSelector } from "react-redux";
import { Card, Image, Icon } from "semantic-ui-react";
import abstractlogo from "../about512.png";

export const AboutGrid = () => {
  const page = useSelector((state) => state.page);

  const ericExtra = (
    <>
      <Icon name="angle right" />
      <a className="donate-with-crypto" target="_blank" rel="noreferrer" href="https://www.imjustageek.com">
        {" "}
        Come check out my personal site.
      </a>
    </>
  );

  const jearlsExtra = (
    <>
      <Icon name="angle right" />
      <a
        className="donate-with-crypto"
        target="_blank"
        rel="noreferrer"
        href="https://www.linkedin.com/in/jonathanearles/"
      >
        {" "}
        Come check out my LinkedIn.
      </a>
    </>
  );

  return (
    <div className={page === "about" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>
      <div className="viz_nar" style={{ margin: "auto" }}>
        <div className="donationTitle">
          <h1>Hey, welcome to catchfire.finance! </h1>
        </div>
        <div className="textBody">
          Here you can find real-time data about what is being talked about over social media in the world of finance.
          Our goal here is to give insights about what is being discussed and give a general sense of how people are
          talking about it through seven core human emotions: Joy, Fear, Anger, Sadness, Confidence, Tentativeness, and
          Analysis.
          <br></br>
          <br></br>Nothing on this site is meant to be investment advice. Still, it could provide insight into where to
          start researching to gain new and novel insights. The Home page offers holistic data on all keywords analyzed
          on this site. In contrast, the Ticker page provides more in-depth information about the selected keywords in
          the search bar. Each graphic has an explanation slider which will give more detail about what is being
          displayed.
          <br></br>
          <br></br>Thanks for checking the site out!
        </div>
      </div>
      <div className="viz_nar" style={{ margin: "auto" }}>
        <Image src={abstractlogo} size="large" />
      </div>{" "}
      <div className="viz_wide">
        <div className="donationTitle">
          <h1>The team. </h1>
        </div>
        <div className="donation">
          <Card.Group centered>
            <Card
              header="Eric Taylor"
              meta="Co-Founder / Front-End and Data Guy"
              description="By day a designer of computer chips and computer chip accessories."
              extra={ericExtra}
            ></Card>
            <Card
              header="Jonathan Earles"
              meta="Co-Founder / Back-End Guy"
              description="By day a Senior Shitlord Codemonkey."
              extra={jearlsExtra}
            />
          </Card.Group>
        </div>
      </div>{" "}
    </div>
  );
};
