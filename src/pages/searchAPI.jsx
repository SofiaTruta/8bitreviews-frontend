import { useEffect, useState, useContext } from 'react'
import { Form, Button, Dropdown, Container, Row, Col, Modal } from 'react-bootstrap'
import { Context } from '../context';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Navbar from '../components/navbar';

const SearchAPI = () => {
    const { BACKEND_API, AUTH_PASS, AUTH_USER, getCSRFToken, csrfToken } = useContext(Context)
    const APIKey = process.env.REACT_APP_RAPIDAPI_KEY
    const APIHost = process.env.REACT_APP_RAPIDAPI_HOST

    const [searchTerm, setSearchTerm] = useState('')
    const [searchResult, setSearchResult] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const [displayItem, setDisplayItem] = useState(null)
    const [chosenGame, setChosenGame] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [cookies] = useCookies(['user_id'])

    const handleSearch = async (event) => {
        event.preventDefault()
        try {
            setIsLoading(true)

            const option = {
                method: 'GET',
                url: 'https://opencritic-api.p.rapidapi.com/game/search',
                params: {
                    criteria: `${searchTerm}`
                },
                headers: {
                    'X-RapidAPI-Key': APIKey,
                    'X-RapidAPI-Host': APIHost
                }
            }
            const response = await axios.request(option)
            setSearchResult(response.data)

        } catch (error) {
            console.log('Error searching API:', error)
        } finally {
            setIsLoading(false)
        }
    };

    const fetchGame = async () => {
        try {
            const option = {
                method: 'GET',
                url: `https://opencritic-api.p.rapidapi.com/game/${selectedItem}`,
                headers: {
                    'X-RapidAPI-Key': '58e05d70admsh3fdb00d6b944093p1d0af9jsn5ca1648088f6',
                    'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
                }
            }
            const response = await axios.request(option)
            // console.log(response.data)
            setDisplayItem(response.data)

        } catch (error) {
            console.log('Error searching API:', error)
        }
    }


    const chooseMe = () => {
        if (displayItem) {

            const genreNames = displayItem.Genres.map(genre => genre.name)
            // console.log('genreNames', genreNames)

            const chosenGame = {
                name: displayItem.name,
                description: displayItem.description,
                release_date: displayItem.firstReleaseDate,
                genres: genreNames,
                image_url: `http://img.opencritic.com/${displayItem.images.banner.og}`,
                user: cookies.user_id
            }

            console.log(chosenGame)
            setChosenGame(chosenGame)
        }
    }

    const handleSubmit = async () => {
        getCSRFToken()
        console.log('chosen Game', chosenGame)
        const stringifiedChosenGame = JSON.stringify(chosenGame)
        try {
            const response = await axios.post(
                `${BACKEND_API}/new-game/`,
                stringifiedChosenGame,
                {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    }
                })
            console.log('new game', response)
            navigate('/')

        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (event) => {
        setSearchTerm(event.target.value)
        setSelectedItem(null)
        setDisplayItem(null)
    }

    const handleDropdownSelect = (id) => {
        setSelectedItem(id)
    }

    const handleClearSelection = () => {
        setSearchTerm(null)
        setSelectedItem(null)
        setDisplayItem(null)
    }

    const handleYesClick = () => {
        chooseMe()
        setDisplayItem(null);
    };

    const handleNoClick = () => {
        handleClearSelection()
    };

    useEffect(() => {
        if (selectedItem != null) {
            fetchGame()
        } // eslint-disable-next-line
    }, [selectedItem])

    useEffect(() => {
        if (chosenGame != null) {
            handleSubmit()
        } // eslint-disable-next-line
    }, [chosenGame])

    return (
        <>
            <Navbar />

            <Container className="mt-5">
                <Row className="mb-4 justify-content-center">
                    <Col>
                        <div className="p-4 d-flex justify-content-center flex-column">
                            <p className="welcome-text">
                                Our friends over at OpenCritic have a huge database of games
                            </p>
                            <p>
                                search for your game and I bet they'll help us find it!
                            </p>
                        </div>
                    </Col>
                </Row>

                <div className="d-flex justify-content-center">
                    <Form className="d-flex flex-column align-items-center">
                        <Form.Group className="text-center">
                            <Form.Label>Search for a game:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter search term"
                                value={searchTerm}
                                onChange={handleChange}
                                style={{ width: '300px' }}
                                className="text-center"
                            />
                        </Form.Group>
                        <Button
                            type='submit'
                            variant="outline-secondary" className='retro-button mt-2'
                            onClick={handleSearch}
                            disabled={isLoading}
                            style={{ width: '150px' }}
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </Button>
                    </Form>
                </div>

                {/* Display the search result */}
                <div className="d-flex justify-content-center">
                    {searchResult && (
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" className='retro-button mt-2'>
                                Select an item
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {searchResult.map(item => (
                                    <Dropdown.Item key={item.id} onClick={() => handleDropdownSelect(item.id)}>
                                        {item.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>


                <Modal show={!!displayItem} onHide={handleClearSelection} className='dark-mode'>
                    <Modal.Header closeButton className='dark-mode'>
                        <Modal.Title>Is this the one?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='dark-mode'>
                        {displayItem && (
                            <>
                                <img src={`https://img.opencritic.com/${displayItem.images.banner.og}`} alt='game cover' />
                                <p className='mt-4'>Name: {displayItem.name}</p>
                                <p>Genre: {displayItem.Genres[0].name}</p>
                                <p>Description: {displayItem.description}</p>
                                <p>Release date: {displayItem.firstReleaseDate && new Date(displayItem.firstReleaseDate).toLocaleDateString()}</p>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer className='dark-mode'>
                        <Button
                            variant="outline-secondary" className='retro-button mt-2'
                            style={{ borderColor: 'rgb(18, 222, 208)', color: 'rgb(18, 222, 208)' }}
                            onClick={handleYesClick}>
                            Yes
                        </Button>
                        <Button
                            variant="outline-secondary" className='retro-button mt-2'
                            onClick={handleNoClick}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>

    );
}

export default SearchAPI;