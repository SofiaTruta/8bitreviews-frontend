import { useContext } from 'react'
import { Context } from '../context'
import Navbar from "../components/navbar"
import { Card, Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Profile = () => {
    const { userGames, userReviews } = useContext(Context);

    // Function to render game cards
    const renderGameCards = () => {
        if (userGames && userGames.length > 0) {
            return userGames.map((game, index) => (
                <Col key={index} lg={4} md={6} sm={12}>
                    <Link to={`/games/${game.id}`} className="link-unstyled">
                        <Card className="dark-mode">
                            <Card.Body>
                                <Card.Img src={game.cover_url} alt={game.title} />
                                <Card.Title>{game.title}</Card.Title>
                                <Card.Text>Genre: {game.genre}</Card.Text>
                                <Card.Text>Description: {game.description}</Card.Text>
                                <Card.Text>Release Date: {game.release_date}</Card.Text>
                                <Card.Text>Genre: {game.genre}</Card.Text>
                            </Card.Body>
                        </Card>
                        </Link >
                </Col>
            ));
        } else {
    return <p>No games available.</p>;
}
    };

// Function to render review cards
const renderReviewCards = () => {
    if (userReviews && userReviews.length > 0) {
        return userReviews.map((review, index) => (
            <Col key={index} lg={4} md={6} sm={12}>
                <Card className="dark-mode m-2">
                    <Card.Body>
                        <Card.Title>Game: {review.game}</Card.Title>
                        {/* need to find a way to retrieve the game name here */}
                        <Card.Text>Date submitted:{review.date_submitted}</Card.Text>
                        <Card.Text>Score:{review.score}</Card.Text>
                        <Card.Text>Review: {review.review}</Card.Text>
                        {/* Other review details */}
                    </Card.Body>
                </Card>
            </Col>
        ));
    } else {
        return <p>No reviews available.</p>;
    }
};

return (
    <>
        <Navbar />
        <Container className="mt-4">
            <h2 className="mb-4">My Games</h2>
            <Row>{renderGameCards()}</Row>

            <h2 className="mt-5 mb-4">My Reviews</h2>
            <Row>{renderReviewCards()}</Row>
        </Container>
    </>
);
}

export default Profile;