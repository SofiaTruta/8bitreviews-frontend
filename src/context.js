import React, { createContext, useState } from 'react'
import axios from 'axios';
import { useCookies } from 'react-cookie'

const Context = createContext()

const ContextProvider = ({ children }) => {
    // state
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState(null)
    const [userDetails, setUserDetails] = useState({
        email: '',
        first_name: '',
        id: '',
        last_name: '',
        url: '',
        username: ''
    })
    const [games, setGames] = useState(null);
    const [userGames, setUserGames] = useState([
        {
            id: '',
            name: '',
            description: '',
            genre: '',
            release_date: '',
            image_url: '',
            user: ''
        }
    ])
    const [userReviews, setUserReviews] = useState([{
        date_submitted: '',
        game: '',
        id: '',
        score: '',
        review: '',
        user: ''
    }])

    const [csrfToken, setCsrfToken] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken'])

    const [loading, setLoading] = useState(true)

    // other variables
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;

    const AUTH_USER = process.env.REACT_APP_AUTH_USER
    const AUTH_PASS = process.env.REACT_APP_AUTH_PASS

    // * functions login, logout
    async function getCSRFToken() {
        try {
            const response = await axios.get(`${BACKEND_API}/get-csrf-token/`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                }
            })
            setCsrfToken(response.csrf_token)

        } catch (error) {
            console.log('error getting csrf', error)
        }
    }

    async function loginUser(username, password) {
        try {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('password', password)

            getCSRFToken()
            const response = await axios.post(`${BACKEND_API}/api/login`, formData, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken
                }
            })

            const accessToken = response.data.access
            const userId = response.data.user_id

            setUserId(response.data.user_id)

            const expiration = new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hour
            setCookie('accessToken', accessToken, { path: '/', expires: expiration })
            setCookie('user_id', userId, { path: '/', expires: expiration })
            setIsLoggedIn(true)
        } catch (error) {
            console.log('error logging in', error)
        }
    }

    async function logout() {
        if (cookies.accessToken) {
            removeCookie('accessToken', { path: '/' });
            removeCookie('user_id', { path: '/' });
            setIsLoggedIn(false);

            try {
                await axios.post(
                    `${BACKEND_API}/api/logout`,
                    cookies.accessToken,
                    {
                        headers: {
                            'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-CSRFToken': csrfToken
                        }
                    }
                );
            } catch (error) {
                console.log('error logging out', error);
            }
        }
    }

    //* fetch data and populate
    async function getGames() {
        setLoading(true)
        try {
            const response = await axios.get(`${BACKEND_API}/games`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            setGames(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    

    //*CHECKS IF COOKIES ARE SET AND FETCHES DATA BASED ON THAT SPECIFIC USER
    async function checkIfLoggedIn() {
        try {
            if (cookies.user_id) {
                setUserId(cookies.user_id)
                setIsLoggedIn(true)
                const response = await axios.get(`${BACKEND_API}/users/${cookies.user_id}`, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                
                setUserId(response.data.user.id)
                setUserGames(response.data.games)
                setUserDetails(response.data.user)
                setUserReviews(response.data.reviews)
            
            }

        } catch (error) {
            console.log('error getting user details', error)
        }
    }



    return (
        <Context.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                games,
                userGames,
                getGames,
                userId,
                userDetails,
                setUserId,
                loginUser,
                logout,
                checkIfLoggedIn,
                userReviews,
                setUserReviews,
                BACKEND_API, 
                AUTH_PASS,
                AUTH_USER, 
                cookies,
                getCSRFToken,
                csrfToken,
                loading,
                setLoading
            }}>
            {children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }