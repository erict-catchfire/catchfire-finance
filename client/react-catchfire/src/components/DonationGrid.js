import React from "react";
import { useSelector } from "react-redux";
import { Card, Image, Button, Icon } from "semantic-ui-react";
import patreon from "../patreon_mod.png";
import coinbase from "../coinbase_mod.png";
import shibu from "../shibu_mod.png";

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
      <a class="donate-with-crypto" href="https://commerce.coinbase.com/checkout/a46ac12c-44a7-494a-9f53-335ba8d0dd6b">
        {" "}
        Donate with Cash or Crypto
      </a>
      <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807"></script>
    </a>
  );

  const patronExtra = (
    <a>
      <Icon name="angle right" />
      <a class="donate-with-crypto" href="https://commerce.coinbase.com/checkout/a46ac12c-44a7-494a-9f53-335ba8d0dd6b">
        {" "}
        Donate through Patreon
      </a>
    </a>
  );

  const cryptoExtra = (
    <a>
      <Icon name="angle right" />
      <a class="donate-with-crypto" href="https://commerce.coinbase.com/checkout/a46ac12c-44a7-494a-9f53-335ba8d0dd6b">
        {" "}
        Donate with Other Crypto
      </a>
    </a>
  );

  return (
    <div className={page == "donation" ? "VizGrid fadeIn" : "VizGrid fadeOut"}>
      <div className="viz_wide">
        <div className="donationTitle">
          <h1>Help keep this site going. </h1>
        </div>
        <div className="donation">
          <Card.Group centered>
            <Card
              image={coinbase}
              header="Coinbase"
              description="Help out with a one time crypto or dollar donation through Coinbase."
              extra={coinbaseExtra}
            ></Card>
            <Card
              image={patreon}
              header="Patreon"
              description="Help out with a montly donation and you can get special access to historical data and Discord permissions."
              extra={patronExtra}
            />
            <Card
              image={shibu}
              header="Other Crypto"
              description="Help out with various other cryptos."
              extra={cryptoExtra}
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
