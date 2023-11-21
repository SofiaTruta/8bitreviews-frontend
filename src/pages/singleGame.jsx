import { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import Navbar from "../components/navbar";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import ReviewModal from '../components/ReviewModal.jsx'
import { getCurrentDate } from '../utils/utils.js';
import EditReviewModal from '../components/EditReviewModal.jsx';

const SingleGame = () => {
    const { BACKEND_API, AUTH_PASS, AUTH_USER, isLoggedIn, userId, userDetails } = useContext(Context)

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

    const getSingleGame = async () => {
        try {
            const response = await axios.get(`${BACKEND_API}/games/${id}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            setSingleGame(response.data.game)
            setReviewsForGame(response.data.reviews)

        } catch (error) {
            console.log('error getting single game', error)
        }
    }

    const findReviewUser = async () => {
        try {
            const updatedReviews = await Promise.all(
                reviewsForGame.map(async (review) => {
                    const response = await axios.get(`${BACKEND_API}/rev-user/${review.user}`, {
                        headers: {
                            'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });

                    //now for each response, take the response.data.username and set as the user of updatedReviewsForGame, and then copy all other keys apart from user from reviewsForGame
                    const updatedReview = { ...review }
                    updatedReview.user = response.data.username;

                    return updatedReview;
                })
            );
            setUpdatedReviewsForGame(updatedReviews)
        } catch (error) {
            console.log('Error fetching user details for reviews:', error);
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

            const response = await axios.post(`${BACKEND_API}/reviews/`, newReview, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/json'
                }
            });

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

    const [isUpdated, setIsUpdated] = useState(false)

    const handleDeleteReview = async (review_id) => {
        try {
            const response = await axios.delete(`${BACKEND_API}/reviews/${review_id}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/json'
                }
            })
            setIsUpdated(true)

        } catch (error) {
            console.log('error deleting a review', error)
        }
    }

    //EDITING REVIEW MODAL
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingReview, setEditingReview] = useState(null)

    const handleEditReviewSubmission = async (reviewId, editData) => {
        try {
            const response = await axios.put(`${BACKEND_API}/reviews/${reviewId}`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {

        }
    }


    const handleShowEditReviewModal = () => {
        setShowEditModal(!showEditModal)
    }
    
    // get the game
    useEffect(() => {
        getSingleGame()
        
        if (newReview.review !== '') {
            postNewReview()
        }
        setIsUpdated(false)
    }, [id, newReview, isUpdated] )

    // get details about the reviews for the game
    useEffect(() => {
        if (reviewsForGame.length > 0 && reviewsForGame.every(review => review.user !== '')) {
            findReviewUser()
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

    // useEffect(() => {
    //     console.log('this useEffect has been triggered!')
    //     const fetchData = async () => {
    //         await getSingleGame();
    //     };
    
    //     if (isUpdated) {
    //         fetchData();
    //         setIsUpdated(false); // Resetting isUpdated immediately after triggering the update
    //     }
    // }, [isUpdated]);

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
                                        {/* CONDITIONALLY RENDER THIS PLEASE */}
                                        <Card.Footer>
                                            {isLoggedIn && review.user === userDetails.username && (
                                                <>
                                                    <Button onClick={() => handleDeleteReview(review.id)}>Delete Review</Button>
                                                    {/* <Button onClick={() => handleShowEditReviewModal(review.id)}>Edit Review</Button>
                                                    {showEditModal && (
                                                        <EditReviewModal
                                                            show={() => setShowEditModal(!showEditModal)}
                                                            review_score={review.score}
                                                            review_review={review.review}
                                                        // update these props lol
                                                        />
                                                    )} */}
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