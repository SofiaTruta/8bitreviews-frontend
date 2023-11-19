import React, { createContext, useState } from 'react'
import axios from 'axios';

const Context = createContext()

const ContextProvider = ({ children }) => {
    // state
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [csrfToken, setCsrfToken] = useState(null)

    const [games, setGames] = useState(null);

    // other variables
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;

    const AUTH_USER = process.env.REACT_APP_AUTH_USER
    const AUTH_PASS = process.env.REACT_APP_AUTH_PASS

    // functions
    const toggleLogin = () => {
        setIsLoggedIn((prevLoggedIn) => !prevLoggedIn)

        if (!isLoggedIn && user) {
            loginUser(user.username, user.password)
        }
    }

    async function getCSRFToken() {
        try {
            const response = await axios.get(`${BACKEND_API}/get-csrf-token/`,{
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                }
            })
            console.log('csrf token',response.data.csrf_token)
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
            console.log('login response', response)
            const { accessToken, refreshToken } = response.data
            //SET COOKIES HERE EVENTUALLY
            

            setIsLoggedIn(true)
        } catch (error) {
            console.log('error logging in', error)
        }
    }

    async function getGames() {
        try {
            const response = await axios.get(`${BACKEND_API}/games`, {
                headers: {
                    'Authorization': 'Basic ' + btoa(`${AUTH_USER}:${AUTH_PASS}`),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            setGames(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Context.Provider
            value={{
                isLoggedIn,
                toggleLogin,
                games,
                getGames,
                user,
                setUser,
                loginUser
            }}>
            {children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }