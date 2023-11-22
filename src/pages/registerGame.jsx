import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../components/navbar';
import { Form, Button } from 'react-bootstrap';


const RegisterGame = () => {
    const { userId, BACKEND_API, AUTH_PASS, AUTH_USER, getCSRFToken, csrfToken, isLoggedIn } = useContext(Context)
    const navigate = useNavigate();
    // const [cookies, setCookie, removeCookie] = useCookies(['accessToken'])

    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        description: '',
        release_date: '',
        cover_url: '',
        user: userId
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'release_date') {
            // Format the date to YYYY-MM-DD
            const formattedDate = new Date(value).toISOString().split('T')[0]

            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: formattedDate
            }));
        } else {
            // other fields 
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        getCSRFToken()
        try {
            const response = await axios.post(
                `${BACKEND_API}/new-game/`,
                formData,
                {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrfToken
                    }
                })
            console.log('new game', response)
            navigate('/')

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (userId) {
            setFormData({
                title: '',
                genre: '',
                description: '',
                release_date: '',
                cover_url: '',
                user: userId
            });
        }
    }, [userId])

    return (
        <>
            <Navbar />
            {isLoggedIn ? (
                <>
                    <div>Register Game Form</div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formGenre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formReleaseDate">
                            <Form.Label>Release Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Enter release date"
                                name="release_date"
                                value={formData.release_date}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCoverUrl">
                            <Form.Label>Cover URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter cover art URL"
                                name="cover_url"
                                value={formData.cover_url}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Register Game
                        </Button>
                    </Form>

                    <h3>or</h3>
                    <Link to='/search-api'><Button>Search in our database for a game</Button></Link>
                </>
            ) : (
                <div>Please log in to register a game</div>
            )}
        </>

    );
}

export default RegisterGame;