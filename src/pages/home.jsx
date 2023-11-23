import { useContext, useEffect } from 'react';
import Navbar from '../components/navbar';
import { Context } from '../context';
import { Card, Col, Row, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Home() {
  const { getGames, games, checkIfLoggedIn, isLoggedIn } = useContext(Context)

  useEffect(() => {
    getGames()
    checkIfLoggedIn()
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar />
      <Container className="mt-4 text-center">
        {!isLoggedIn && (
          <Row className="mb-4">
            <Col>
              <Card className="p-4 dark-mode welcome-card">
                <p className="welcome-text">
                  From platform hoppers to farm simulator dwellers, all are welcome.
                </p>
                <p>
                  Tell us what games you have been playing <br />
                  Share your reviews on games <br />
                </p>
                <Link to='/sign-up'><Button variant="outline-secondary retro-button">
                  Sign Up<span className="tiny-text">to add games and leave reviews</span>
                </Button></Link>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="mb-4">
          <Col>
            <h2 className="text-center mb-4" style={{fontFamily:'Varela, sans-serif'}}>Games List</h2>
          </Col>
        </Row>

        <Row xs={1} md={2} className="g-4">
          {games && games.map((game) => (
            <Link to={`games/${game.id}`} key={game.id} className="link-unstyled">
              <Card className="dark-mode m-3">
                <Card.Img variant="top" src={game.image_url} alt={game.name} />
                <Card.Body>
                  <Card.Title>{game.name}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Home;