import React from "react";
import { Image, Divider } from "semantic-ui-react";

export const Footer = () => {
  return (
    <div className="Footer">
      <div className="FooterUpper">
        <div>
          <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
        </div>
        <div>
            <div className="Title">catchfire.finance</div>
            Austin, TX <br />
            contact@catchfire.finance
        </div>
      </div>
      <div className="FooterLower">
          <div style={{borderRight:"1px"}}>Copyright (c) catchfire.finance. All Rights Reserved.</div>
          <div>Privicy Policy</div>
          <div>Legal</div>
      </div>
    </div>
  );
};
