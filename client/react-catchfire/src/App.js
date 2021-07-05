import "./App.css";
import React from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { VizGrid } from "./components/VizGrid";
import { HomeGrid } from "./components/HomeGrid";
import { AboutGrid } from "./components/AboutGrid";
import { DonationGrid } from "./components/DonationGrid";
import { useSelector } from "react-redux";
import background from "./background.png"

const footerHeight = 200;
const logoHeight = 50;
const logoWidth = 270;

function App() {
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;
  const page = useSelector((state) => state.page);

  return (
    <div className="App">
      <Header className="Header" logoWidth={logoWidth} logoHeight={logoHeight} />
      <div className="GridContainer">
        <div className="Header-Shell"> </div>
        <div className="Left" style={{backgroundImage: `url(${background})`}}> 
          {/* <img className="img-backleft" src={background} alt="background" style={{objectFit:"cover",maxHeight:"100%"}}></img> */}
        </div>
        <div>
          <HomeGrid />
          <VizGrid />
          <AboutGrid />
          <DonationGrid />
        </div>
        <div className="Right" style={{backgroundImage: `url(${background})`}}> 
          {/* <img className="img-backleft" src={background} alt="background" style={{objectFit:"cover",maxHeight:"100%"}}></img> */}
        </div>
        <Footer className="Footer" footerHeight={footerHeight} innerWidth={innerWidth} innerHeight={innerHeight} />
      </div>
    </div>
  );
}

export default App;
