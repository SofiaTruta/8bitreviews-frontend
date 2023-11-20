import { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import Navbar from "../components/navbar";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';

const SingleGame = () => {
    const { BACKEND_API, AUTH_PASS, AUTH_USER } = useContext(Context)
    // const BACKEND_API = process.env.REACT_APP_BACKEND_API
    // const AUTH_USER = process.env.REACT_APP_AUTH_USER
    // const AUTH_PASS = process.env.REACT_APP_AUTH_PASS

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
        // console.log('gameId', id)
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

    useEffect(() => {
        getSingleGame()
    }, [id])
    return (
        <>
            <Navbar />
            <>
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
                <Container className="dark-mode mt-4">
                    <Row>
                        {reviewsForGame.map((review, index) => (
                            <Col key={index}>
                                <Card className="dark-mode mb-3">
                                    <Card.Body>
                                        <Card.Title>Score: {review.score}</Card.Title>
                                        <Card.Text>Review: {review.review}</Card.Text>
                                        //need to find a way to get username for this userid on the review
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