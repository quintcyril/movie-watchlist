import { useState } from 'react';
import './App.css';

import MovieWatchListMain from './Components/MovieWatchlist/Main';
import Login from './Components/MovieWatchlist/Login';
import ReviewScreen from './Components/MovieWatchlist/ReviewScreen';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div>
      <h1>Welcome, {user}</h1>
      <MovieWatchListMain />
      <ReviewScreen />
    </div>
  );
}

export default App;