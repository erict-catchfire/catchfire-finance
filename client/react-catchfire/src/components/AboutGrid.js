//import React, { useEffect, useState } from 'react';
import React from "react";
import { useSelector } from "react-redux";
import { Card, Image, Button, Icon } from "semantic-ui-react";

export const AboutGrid = () => {
  const page = useSelector((state) => state.page);

  const ericExtra = (
    <a>
      <Icon name="angle right" />
      <a class="donate-with-crypto" href="https://www.imjustageek.com">
        {" "}
        Come check out my personal site.
      </a>
    </a>
  );

  const jearlsExtra = (
    <a>
      <Icon name="angle right" />
      <a class="donate-with-crypto" href="https://www.imjustageek.com">
        {" "}
        Come check out my personal site.
      </a>
    </a>
  );

  return (
    <div className={page == "about" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>
      <div className="viz_wide">
        <div className="donationTitle">
          <h1>Hey, welcome to catchfire.finance! </h1>
        </div>
        <div className="textBody">
          Here you can find real-time data about what is being talked about over social media in the world of finance.
          Our goal here is to give insights about what is being discussed and give a general sense of how people are
          talking about it through seven core human emotions: Joy, Fear, Anger, Sadness, Confidence, Tentativeness, and
          Analysis.
          <br></br><br></br>Nothing on this site is meant to be investment advice. Still, it could provide insight into where to
          start researching to gain new and novel insights. The Home page offers holistic data on all keywords analyzed
          on this site. In contrast, the Ticker page provides more in-depth information about the selected keywords in
          the search bar. Each graphic has an explanation slider which will give more detail about what is being
          displayed. Thanks for checking the site out!
        </div>
        <div className="donation"></div>
      </div>{" "}
      <div className="viz_wide">
        <div className="donationTitle">
          <h1>The team. </h1>
        </div>
        <div className="donation">
          <Card.Group centered>
            <Card
              image="https://lh3.googleusercontent.com/proxy/kj9gM4xpm2occ0kKZOFj0KUOoKvpIoXLsGkkeqn1ibiVp44H0yaO3p14fcwAXsbcGaRo8gyos1KHt5m1C4wLj7ASyBhQM5Q"
              header="Eric Taylor"
              meta="Co-Founder / Front-End and Data Guy"
              description="Help out with a one time crypto or dollar donation through Coinbase."
              extra={ericExtra}
            ></Card>
            <Card
              image="https://lh3.googleusercontent.com/proxy/kj9gM4xpm2occ0kKZOFj0KUOoKvpIoXLsGkkeqn1ibiVp44H0yaO3p14fcwAXsbcGaRo8gyos1KHt5m1C4wLj7ASyBhQM5Q"
              header="Jonathan Earles"
              meta="Co-Founder / Back-End Guy"
              description="Help out with a montly donation and you can get special access to historical data and Discord permissions."
              extra={jearlsExtra}
            />
          </Card.Group>
        </div>
      </div>{" "}
    </div>
  );
};
