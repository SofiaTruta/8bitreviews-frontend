import axios from "axios"

export const getSingleGame = async (id, BACKEND_API, AUTH_USER, AUTH_PASS, setSingleGame, setReviewsForGame) => {
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



export const findReviewUser = async (reviewsForGame, BACKEND_API, AUTH_USER, AUTH_PASS, setUpdatedReviewsForGame) => {
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

export const postNewReview = async (newReview, BACKEND_API, AUTH_USER, AUTH_PASS, setNewReview, userId, id) => {
    try {
// eslint-disable-next-line no-unused-vars
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

export const handleDeleteReview = async (review_id, BACKEND_API, AUTH_USER, AUTH_PASS, setIsUpdated) => {
    try { // eslint-disable-next-line no-unused-vars
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