import './App.css';
import React, {useEffect, useState} from 'react';
import { Movies } from "./components/Movies"
import { MovieForm } from './components/MovieForm';
import { Container } from 'semantic-ui-react';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/movies').then(
      response => response.json().then(data => {
        setMovies(data.movies)
      })
    )
  }, [])

  return (
    <div className="App">
      <Container style={{marginTop:40}}>
        <MovieForm onNewMovie={movie => setMovies(currentMovies => [movie, ...currentMovies])}/>
        <Movies movies = { movies } />
      </Container>
    </div>
  );
}

export default App;
