import { useContext, useEffect } from 'react';
import Navbar from '../components/navbar';
import { Context } from '../context';
import { Card} from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Home() {
  const { getGames, games, userId, isLoggedIn, checkIfLoggedIn } = useContext(Context)

  useEffect(() => {
    getGames()
    checkIfLoggedIn()
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h2>List of Games</h2>

        {games && games.map((game) => (
          <Link to={`games/${game.id}`} key={game.id} className="link-unstyled">
            <Card className="dark-mode m-3">
            <Card.Img variant="top" src={game.cover_url} alt={game.title} />
              <Card.Body>
                <Card.Title>{game.title}</Card.Title>
                <Card.Text>Genre: {game.genre}</Card.Text>
                <Card.Text>Genre: {game.genre}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        ))}

      </div>
    </>
  );
}

export default Home;