import { useContext, useEffect } from 'react';
import Navbar from '../components/navbar';
import { Context } from '../context';
import { useCookies } from 'react-cookie'
import axios from 'axios';

function Home() {
  const { getGames, games, userId, setUserId, username, setUsername, isLoggedIn, setIsLoggedIn, checkIfLoggedIn } = useContext(Context)

  useEffect(() => {
    getGames()
    checkIfLoggedIn()
  }, []);

  useEffect(() => {
    // second useEffect to wait for state updates
    console.log('Updated userId:', userId);
    console.log('Is user logged in:', isLoggedIn);

    if (userId) {
      checkIfLoggedIn()
    }
  }, [userId, isLoggedIn]);

  return (
    <>
      <Navbar />
      <div>
        <h2>List of Games</h2>
        <ul>
          {games && games.map((game) => (
            <li key={game.id}>
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Home;