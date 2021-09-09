import "./App.css";
import React from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { VizGrid } from "./components/VizGrid";
import { HomeGrid } from "./components/HomeGrid";
import { AboutGrid } from "./components/AboutGrid";
import { PPGrid } from "./components/PPGrid";
import { TandMGrid } from "./components/TandMGrid";
import { DonationGrid } from "./components/DonationGrid";
import background from "./background.png";
import ReactGA from 'react-ga4';

const footerHeight = 200;
const logoHeight = 50;
const logoWidth = 270;

const TRACKING_ID = "G-9H2Z94DY71";
ReactGA.initialize(TRACKING_ID);

function App() {
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  return (
    <div className="App">
      <Header className="Header" logoWidth={logoWidth} logoHeight={logoHeight} />
      <div className="GridContainer">
        <div className="Header-Shell"> </div>
        <div className="Left" style={{ backgroundImage: `url(${background})` }}>
          {/* <img className="img-backleft" src={background} alt="background" style={{objectFit:"cover",maxHeight:"100%"}}></img> */}
        </div>
        <div>
          <HomeGrid />
          <VizGrid />
          <AboutGrid />
          <DonationGrid />
          <PPGrid />
          <TandMGrid />
        </div>
        <div className="Right" style={{ backgroundImage: `url(${background})` }}>
          {/* <img className="img-backleft" src={background} alt="background" style={{objectFit:"cover",maxHeight:"100%"}}></img> */}
        </div>
        <Footer className="Footer" footerHeight={footerHeight} innerWidth={innerWidth} innerHeight={innerHeight} />
      </div>
    </div>
  );
}

export default App;
