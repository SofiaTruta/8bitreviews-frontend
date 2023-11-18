import { useContext, useEffect } from 'react';
import Navbar from '../components/navbar';
import { Context } from '../context';

function Home() {
  const { getGames, games } = useContext(Context);

  useEffect(() => {
    getGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <>
      <Navbar />
      <div>
        <h2>List of Games</h2>
        <ul>
          {games && games.map((game)=> (
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