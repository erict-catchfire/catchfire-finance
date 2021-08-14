import React from "react";
import { useSelector } from "react-redux";
import { Card, Image, Button, Icon } from "semantic-ui-react";
import patreon from "../patreon_mod.png";
import coinbase from "../coinbase_mod.png";
import bmac from "../bmac_mod.png";

export const DonationGrid = () => {
  const page = useSelector((state) => state.page);

  const items = [
    {
      header: "Income Report - If WE hAd OnE",
      description: "Income report for ???.",
      meta: "Costs: ???",
    },
  ];

  const coinbaseExtra = (
    <a>
      <Icon name="angle right" />
      <a
        class="donate-with-crypto"
        target="_blank"
        href="https://commerce.coinbase.com/checkout/a46ac12c-44a7-494a-9f53-335ba8d0dd6b"
      >
        {" "}
        Donate with Cash or Crypto
      </a>
      <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807"></script>
    </a>
  );

  const patronExtra = (
    <a>
      <Icon name="angle right" />
      <a class="donate-with-pat" target="_blank" href="https://www.patreon.com/catchfirefinance">
        {" "}
        Donate through Patreon
      </a>
    </a>
  );

  const bmacExtra = (
    <a>
      <Icon name="angle right" />
      <a class="donate-with-coffee" target="_blank" href="https://www.buymeacoffee.com/catchfire">
        {" "}
        Donate with Buy Me a Coffee
      </a>
    </a>
  );

  return (
    <div className={page == "donation" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>
      <div className="viz_wide">
        <div className="donationTitle" style={{ paddingTop: "3.4em" }}>
          <h1>Help keep this site going. </h1>
        </div>
        <div className="donation">
          <Card.Group centered>
            <Card
              image={coinbase}
              header="Coinbase"
              description="Help out with a one time crypto donation through Coinbase."
              extra={coinbaseExtra}
            ></Card>
            <Card
              image={patreon}
              header="Patreon"
              description="Help out with a montly donation and you can get special access to historical data and Discord permissions."
              extra={patronExtra}
            />
            <Card
              image={bmac}
              header="Buy Me a Coffee"
              description="Help out with a one time dollar donation through Buy Me a Coffee."
              extra={bmacExtra}
            />
          </Card.Group>
        </div>
      </div>
      <div className="viz_wide">
        <div className="donationTitle">
          <h1> Previous income statements. </h1>
        </div>
        <div className="donation">
          <Card.Group centered items={items} />
        </div>
      </div>
      <div className="viz_wide"></div>
    </div>
  );
};
