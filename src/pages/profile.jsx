import { useContext, useEffect, useState } from 'react'
import { Context } from '../context'
import Navbar from "../components/navbar"
import { Card, Container, Modal, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import typewriterImage from '../styles/assets/typewriter.jpg'

const Profile = () => {
    const { userGames, userReviews } = useContext(Context);
    // reviews with name of the game
    const [updatedUserReviews, setUpdatedUserReviews] = useState(null)
    const [showGameModal, setShowGameModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const openGameModal = () => {
        setShowGameModal(true);
    };

    const openReviewModal = () => {
        setShowReviewModal(true);
    };

    const updateReviewsWithGameNames = () => {
        const updatedReviews = userReviews.map(review => {
            const matchingGame = userGames.find(game => game.id === review.game)
            return {
                ...review,
                game: matchingGame.name
            }

        })

        setUpdatedUserReviews(updatedReviews)
    }

    useEffect(() => {
        updateReviewsWithGameNames()
        // eslint-disable-next-line
    }, [userReviews])

    return (
        <>
            <Navbar />
            <Container className="mt-4">
                <Row className='mt-5'>
                    <Col xs={12} className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                        <Card className="dark-mode" onClick={openGameModal} style={{ maxWidth: '50%'}}>
                            <Card.Img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Games Image" />
                            <Card.Body>
                                <Card.Title>Games I Registered</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} className='mb-3 d-flex flex-column justify-content-center align-items-center'>
                        <Card className="dark-mode" onClick={openReviewModal} style={{ maxWidth: '50%'}}>
                            <Card.Img src={typewriterImage} alt="Games Image"/>
                            <Card.Body>
                                <Card.Title>My reviews</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>


                <Modal show={showGameModal} onHide={() => setShowGameModal(false)} className="custom-modal-width" >
                    <Modal.Header closeButton className='dark-mode'>
                        <Modal.Title>Games I Registered</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='dark-mode'>
                        {userGames && userGames.length > 0 ? (
                            userGames.map((game, index) => (
                                <div key={index} lg={4} md={6} sm={12} className='mb-3'>
                                    <Link className='link-unstyled' to={`/games/${game.id}`}><Card className="dark-mode">
                                        <Card.Body>
                                            <Card.Img src={game.image_url} alt={game.name} />
                                            <Card.Title className='mt-3'>{game.name}</Card.Title>
                                            <Card.Text>Genre: {game.genres && game.genres.join(', ')}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>No games available.</p>
                        )}

                    </Modal.Body>
                </Modal>

                <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} className="custom-modal-width static">
                    <Modal.Header closeButton className='dark-mode'>
                        <Modal.Title>My Reviews</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='dark-mode'>

                        {updatedUserReviews && updatedUserReviews.length > 0 ? (
                            updatedUserReviews.map((review, index) => (
                                <div key={index} lg={4} md={6} sm={12}>
                                    <Card className="dark-mode m-2 static">
                                        <Card.Body>
                                            <Card.Title>{review.game}</Card.Title>
                                            <Card.Text className='mt-2'>Date submitted: {review.date_submitted}</Card.Text>
                                            <Card.Text>Score: {review.score}</Card.Text>
                                            <Card.Text>Review: {review.review}</Card.Text>
                                            {/* Other review details */}
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available.</p>
                        )}
                    </Modal.Body>
                </Modal>
            </Container >
        </>
    );
}

export default Profile;