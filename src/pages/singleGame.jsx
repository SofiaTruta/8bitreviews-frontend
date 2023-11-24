import { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getCurrentDate } from '../utils/utils.js';

import ReviewModal from '../components/ReviewModal.jsx'
import EditReviewModal from '../components/EditReviewModal.jsx';
import Navbar from "../components/navbar";

import { getSingleGame, findReviewUser, postNewReview, handleDeleteReview } from '../utils/singleGameFunctions.js';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';

const SingleGame = () => {
    // VARIABLES
    const { BACKEND_API, AUTH_PASS, AUTH_USER, isLoggedIn, userId, userDetails, loading, setLoading } = useContext(Context)
    const now = getCurrentDate()
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
    const [updatedReviewsForGame, setUpdatedReviewsForGame] = useState(null)
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({
        score: '',
        review: '',
        user: userId,
        game: id,
        date_submitted: ''
    })
    const [isUpdated, setIsUpdated] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    // NEW REVIEW MODAL
    const handleShowReviewModal = () => {
        setShowReviewModal(!showReviewModal);
    };

    const handleReviewSubmission = (formData) => {

        const updatedReview = {
            ...newReview,
            ...formData,
            date_submitted: now
        };

        setNewReview(updatedReview);
        //due to setState delays, we'll listen to this in useEffect and trigger the post to backend from there
        setShowReviewModal(false);
    };

    //EDIT REVIEW MODAL
    const handleEditReviewSubmission = async (reviewId, editData) => {
        try { // eslint-disable-next-line no-unused-vars
            const response = await axios.put(`${BACKEND_API}/reviews/${reviewId}/`, editData, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/json'
                }
            })
            setShowEditModal(false)
            setIsUpdated(true)
        } catch (error) {
            console.log('error editing the review', error)
        }
    }

    const handleShowEditReviewModal = () => {
        setShowEditModal(!showEditModal)
    }

    // get the game
    useEffect(() => {
        getSingleGame(id, BACKEND_API, AUTH_USER, AUTH_PASS, setSingleGame, setReviewsForGame, loading, setLoading)

        if (newReview.review !== '') {
            postNewReview(newReview, BACKEND_API, AUTH_USER, AUTH_PASS, setNewReview, userId, id)
        }
        setIsUpdated(false) // eslint-disable-next-line
    }, [id, newReview, isUpdated])

    // get details about the reviews for the game
    useEffect(() => {
        if (reviewsForGame.length > 0 && reviewsForGame.every(review => review.user !== '')) {
            findReviewUser(reviewsForGame, BACKEND_API, AUTH_USER, AUTH_PASS, setUpdatedReviewsForGame)
        } // eslint-disable-next-line
    }, [reviewsForGame])

    //handle a new review submission
    useEffect(() => {
        if (userId) {
            setNewReview({
                score: '',
                review: '',
                user: userId,
                game: id,
                date_submitted: ''
            });
        } // eslint-disable-next-line
    }, [userId])


    return (
        <>
            <Navbar />
            <>
                <Container className="dark-mode my-4">
                    {loading ? (
                        <Row>
                            <Col className="text-center">
                                <Spinner animation="border" role="status" className='justify-content-center'>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </Col>
                        </Row>
                    ) : (
                        <>
                            {singleGame && (
                                <Row className="justify-content-center">
                                    <Col md={6}>
                                        <h2>{singleGame.name}</h2>
                                        <Card className="dark-mode static">
                                            <Card.Img
                                                variant="top"
                                                src={singleGame.image_url}
                                                alt={singleGame.title}
                                                style={{ maxHeight: '300px', objectFit: 'cover' }}
                                            />
                                            <Card.Body>
                                                <Card.Text>Genre: {singleGame.genres && singleGame.genres.join(', ')}</Card.Text>
                                                <Card.Text>
                                                    Release Date: {new Date(singleGame.release_date).toLocaleDateString()}
                                                </Card.Text>
                                                <Card.Text>Description: {singleGame.description && singleGame.description
                                                    .split('. ')
                                                    .map((sentence, index) => <p key={index}>{sentence.trim()}.</p>)}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            )}
                        </>
                    )
                    }


                    {isLoggedIn && (
                        <Row className="justify-content-center my-4">
                            <Col md={6} className='text-center'>
                                <Button variant="outline-secondary" className='retro-button'
                                    onClick={handleShowReviewModal}
                                    style={{ borderColor: 'rgb(18, 222, 208)', color: 'rgb(18, 222, 208)' }}>
                                    Add a Review
                                </Button>
                            </Col>
                        </Row>
                    )}

                    {/* add a review modal */}
                    {showReviewModal &&
                        <ReviewModal
                            show={handleShowReviewModal}
                            handleClose={handleShowReviewModal}
                            handleReviewSubmission={handleReviewSubmission}
                        />
                    }

                    <Row className="justify-content-center my-4">
                        <Col md={12}>
                            <h4 className="mb-3 d-flex justify-content-center">Reviews for this game</h4>
                            {updatedReviewsForGame && updatedReviewsForGame.length > 0 ? (
                                updatedReviewsForGame.map((review, index) => (
                                    <Col md={12} className='d-flex justify-content-center' key={index}>
                                        <Card className="dark-mode mb-3 static">
                                            <Card.Body>
                                                <Card.Title>Score: {review.score}</Card.Title>
                                                <Card.Text>Review: {review.review && review.review
                                                    .split('. ')
                                                    .map((sentence, index) => <p key={index}>{sentence.trim()}.</p>)}</Card.Text>
                                                <Card.Text>User: {review.user}</Card.Text>
                                            </Card.Body>
                                            {/* if logged in can delete or edit*/}
                                            <Card.Footer>
                                                {isLoggedIn && review.user === userDetails.username && (
                                                    <>
                                                        <Button
                                                            variant="outline-secondary" className='retro-button mx-2'
                                                            onClick={() =>
                                                                handleDeleteReview(
                                                                    review.id,
                                                                    BACKEND_API,
                                                                    AUTH_USER,
                                                                    AUTH_PASS,
                                                                    setIsUpdated
                                                                )
                                                            }
                                                        >
                                                            Delete Review
                                                        </Button>

                                                        <Button
                                                            variant="outline-secondary" className='retro-button mx-2'
                                                            onClick={() => handleShowEditReviewModal(review.id)}>
                                                            Edit Review
                                                        </Button>

                                                        {showEditModal && (
                                                            <EditReviewModal
                                                                show={handleShowEditReviewModal}
                                                                review_score={review.score}
                                                                review_review={review.review}
                                                                reviewId={review.id}
                                                                handleEditReviewSubmission={handleEditReviewSubmission}
                                                                user={userId}
                                                                game={id}
                                                                date={now}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <div className="text-center">
                                    <p>No reviews for this game. Be the first to leave one!</p>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </>
        </>


    );
}

export default SingleGame;