import './App.css';
import React from 'react';
//import { Movies } from "./components/Movies"
//import { MovieForm } from './components/MovieForm';
//import { Container } from 'semantic-ui-react';
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { VizGrid } from "./components/VizGrid"

const footerHeight = 200;
const logoHeight = 50;
const logoWidth = 270;



function App() {
  //const [movies, setMovies] = useState([]);

  //useEffect(() => {
  //  fetch('/movies').then(
  //    response => response.json().then(data => {
  //      setMovies(data.movies)
  //    })
  //  )
  //}, [])
  const innerWidth  = window.innerWidth;
  const innerHeight = window.innerHeight;

  return (
    <div className="App">
      <Header className="Header" 
          logoWidth  = {logoWidth}
          logoHeight = {logoHeight}
      /> 

      <div className="GridContainer">
        <div className="Header-Shell"> </div>

        <div className="Left"> Left </div>

        <VizGrid/>

        <div className="Right"> Right </div>

        <Footer className="Footer" 
          footerHeight = {footerHeight}
          innerWidth   = {innerWidth}
          innerHeight  = {innerHeight}
        /> 
      </div>  
    </div>  
  );
}

export default App;
