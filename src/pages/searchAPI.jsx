import { useEffect, useState, useContext } from 'react'
import { Form, Button, Dropdown } from 'react-bootstrap'
import { Context } from '../context';
import axios from 'axios'

const SearchAPI = () => {
    const { userId, BACKEND_API, AUTH_PASS, AUTH_USER, getCSRFToken, csrfToken } = useContext(Context)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResult, setSearchResult] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const [displayItem, setDisplayItem] = useState(null)
    const [chosenGame, setChosenGame] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async () => {
        try {
            setIsLoading(true)

            const option = {
                method: 'GET',
                url: 'https://opencritic-api.p.rapidapi.com/game/search',
                params: {
                    criteria: `${searchTerm}`
                },
                headers: {
                    'X-RapidAPI-Key': '58e05d70admsh3fdb00d6b944093p1d0af9jsn5ca1648088f6',
                    'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
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

    const chooseMe = () =>{
        if (displayItem){

            const genreNames = displayItem.Genres.map(genre => genre.name)

            const chosenGame = {
                name: displayItem.name,
                description: displayItem.description,
                releaseDate: displayItem.firstReleaseDate,
                genres: genreNames,
                imageUrl: `http://img.opencritic.com/${displayItem.images.banner.og}`
            }

            console.log(chosenGame)
            setChosenGame(chosenGame)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        getCSRFToken()
        console.log(displayItem)
        // try {
        //     const response = await axios.post(
        //         `${BACKEND_API}/new-game/`,
        //         formData,
        //         {
        //             headers: {
        //                 'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
        //                 'Content-Type': 'application/x-www-form-urlencoded',
        //                 'X-CSRFToken': csrfToken
        //             }
        //         })
        //     console.log('new game', response)
        //     navigate('/')

        // } catch (error) {
        //     console.log(error);
        // }
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

    useEffect(() => {
        if (selectedItem != null) {
            fetchGame()
        }
    }, [selectedItem])

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>Search Term</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter search term"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                </Button>
            </Form>

            {/* Display the search result */}
            {searchResult && (
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
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

            {/* Display the selected item */}
            {displayItem && (
                <div>
                    <h2>Is this the one? </h2>
                    <img src={`https://img.opencritic.com/${displayItem.images.banner.og}`} alt='game cover' />
                    <p>Name: {displayItem.name}</p>
                    <p>Genre: {displayItem.Genres[0].name}</p>
                    <p>Name: {displayItem.description}</p>
                    <p>Release date: {displayItem.firstReleaseDate && new Date(displayItem.firstReleaseDate).toLocaleDateString()}</p>
                    <Button onClick={chooseMe}>Yes</Button>
                    <Button onClick={handleClearSelection}>No</Button>
                </div>
            )}
        </>

    );
}

export default SearchAPI;