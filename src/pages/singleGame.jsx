import { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import Navbar from "../components/navbar";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import ReviewModal from '../components/ReviewModal.jsx'
import { getCurrentDate } from '../utils/utils.js';

const SingleGame = () => {
    const { BACKEND_API, AUTH_PASS, AUTH_USER, isLoggedIn, userId } = useContext(Context)

    const { id } = useParams()
    const [singleGame, setSingleGame] = useState(null)
    const [reviewsForGame, setReviewsForGame] = useState([
        {
            date_submitted: '',
            game: '',
            id: '',
            review: '',
            score: '',
            user: ''
        }
    ])

    const getSingleGame = async () => {
        try {
            const response = await axios.get(`${BACKEND_API}/games/${id}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            // console.log(response.data)
            setSingleGame(response.data.game)
            setReviewsForGame(response.data.reviews)

        } catch (error) {
            console.log('error getting single game', error)
        }
    }

    // MODAL AND NEW REVIEW RELATED STUFF
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({
        score: '',
        review: '',
        user: userId,
        game: id,
        date_submitted: ''
    })

    const handleShowReviewModal = () => {
        setShowReviewModal(!showReviewModal);
    };


    const handleReviewSubmission = (formData) => {
        const now = getCurrentDate()

        const updatedReview = {
            ...newReview,
            ...formData,
            date_submitted: now
        };

        setNewReview(updatedReview);
        //due to setState delays, we'll listen to this in useEffect and trigger the post to backend from there
        setShowReviewModal(false);
    };

    const postNewReview = async () => {
        try {
            console.log('new review', newReview)
            const response = await axios.post(`${BACKEND_API}/reviews/`, newReview, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Review submitted:', response.data);
            // clear the slate of the reviews so I can add another one immediately after if I want to
            setNewReview({
                score: '',
                review: '',
                user: userId,
                game: id,
                date_submitted: ''
            });
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    }

    useEffect(() => {
        getSingleGame()
        if (newReview.review !== ''){
            postNewReview()
        }
    }, [id, newReview])

    useEffect(() => {
        if (userId) {
            setNewReview({
                score: '',
                review: '',
                user: userId,
                game: id,
                date_submitted: ''
            });
        }
    }, [userId])

    return (
        <>
            <Navbar />
            <>
                {/* game info */}
                <Container className=" dark-mode mt-4">
                    {singleGame && (
                        <Row>
                            <Col>
                                <h2>{singleGame.title}</h2>
                                <Card className='dark-mode'>
                                    <Card.Img variant="top" src={singleGame.cover_url} alt={singleGame.title} />
                                    <Card.Body >
                                        <Card.Text>Description: {singleGame.description}</Card.Text>
                                        <Card.Text>Genre: {singleGame.genre}</Card.Text>
                                        <Card.Text>Release Date: {singleGame.release_date}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </Container>

                {/* if logged in, see button for adding a review */}
                {isLoggedIn && (
                    <Container className="dark-mode mt-4">
                        <Row>
                            <Col>
                                <Button variant="primary" onClick={handleShowReviewModal}>Add a Review</Button>
                            </Col>
                        </Row>
                    </Container>
                )}

                {/* add a review modal */}
                {showReviewModal &&
                    <ReviewModal
                        show={handleShowReviewModal}
                        handleClose={handleShowReviewModal}
                        handleReviewSubmission={handleReviewSubmission}
                    />
                }


                {/* reviews for game */}
                <Container className="dark-mode mt-4">
                    <Row>
                        <p>Reviews for this game (style me)</p>
                        {reviewsForGame.map((review, index) => (
                            <Col key={index}>
                                <Card className="dark-mode mb-3">
                                    <Card.Body>
                                        <Card.Title>Score: {review.score}</Card.Title>
                                        <Card.Text>Review: {review.review}</Card.Text>
                                        {/* need to find a way to get username for this userid on the review */}
                                        <Card.Text>User: {review.user}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </>
        </>

    );
}

export default SingleGame;