import { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getCurrentDate } from '../utils/utils.js';

import ReviewModal from '../components/ReviewModal.jsx'
import EditReviewModal from '../components/EditReviewModal.jsx';
import Navbar from "../components/navbar";
import GameInfo from '../components/singleGame/gameInfo.jsx';
import AddReviewBtn from '../components/singleGame/addReviewBtn.jsx';

import { getSingleGame, findReviewUser, postNewReview, handleDeleteReview } from '../utils/singleGameFunctions.js';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

const SingleGame = () => {
    // VARIABLES
    const { BACKEND_API, AUTH_PASS, AUTH_USER, isLoggedIn, userId, userDetails } = useContext(Context)
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
    // const [editingReview, setEditingReview] = useState({
    //     score: '',
    //     review: '',
    //     user: userId,
    //     game: id, 
    //     date_submitted: ''
    // })

    // NEW REVIEW MODAL
    const handleShowReviewModal = () => {
        setShowReviewModal(!showReviewModal);
    };

    const handleReviewSubmission = (formData) => {
        // const now = getCurrentDate()

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
        try {
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
        getSingleGame(id, BACKEND_API, AUTH_USER, AUTH_PASS, setSingleGame, setReviewsForGame)

        if (newReview.review !== '') {
            postNewReview(newReview, BACKEND_API, AUTH_USER, AUTH_PASS, setNewReview, userId, id)
        }
        setIsUpdated(false)
    }, [id, newReview, isUpdated])

    // get details about the reviews for the game
    useEffect(() => {
        if (reviewsForGame.length > 0 && reviewsForGame.every(review => review.user !== '')) {
            findReviewUser(reviewsForGame, BACKEND_API, AUTH_USER, AUTH_PASS, setUpdatedReviewsForGame)
        }
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
        }
    }, [userId])


    return (
        <>
            <Navbar />
            <>
                <GameInfo singleGame={singleGame} />

                {/* if logged in, see button for adding a review */}
                {isLoggedIn && (
                    <AddReviewBtn show={handleShowReviewModal} />
                )}

                {/* add a review modal */}
                {showReviewModal &&
                    <ReviewModal
                        show={handleShowReviewModal}
                        handleClose={handleShowReviewModal}
                        handleReviewSubmission={handleReviewSubmission}
                    />
                }

                {/* reviews for this game*/}
                {updatedReviewsForGame && (
                    <Container className="dark-mode mt-4">
                        <Row>
                            <p>Reviews for this game (style me)</p>
                            {updatedReviewsForGame.map((review, index) => (
                                <Col key={index}>
                                    <Card className="dark-mode mb-3">
                                        <Card.Body>
                                            <Card.Title>Score: {review.score}</Card.Title>
                                            <Card.Text>Review: {review.review}</Card.Text>
                                            <Card.Text>User: {review.user}</Card.Text>
                                        </Card.Body>
                                        {/* if logged in can delete or edit*/}
                                        <Card.Footer>
                                            {isLoggedIn && review.user === userDetails.username && (
                                                <>
                                                    <Button onClick={() => handleDeleteReview(review.id, BACKEND_API, AUTH_USER, AUTH_PASS, setIsUpdated)}>Delete Review</Button>

                                                    <Button onClick={() => handleShowEditReviewModal(review.id)}>Edit Review</Button>

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
                            ))}
                        </Row>
                    </Container>

                )}
            </>
        </>

    );
}

export default SingleGame;