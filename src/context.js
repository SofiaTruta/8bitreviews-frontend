import React, { createContext, useState } from 'react'
import axios from 'axios';
import { useCookies } from 'react-cookie'

const Context = createContext()

const ContextProvider = ({ children }) => {
    // state
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [csrfToken, setCsrfToken] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken'])

    const [games, setGames] = useState(null);

    // other variables
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;

    const AUTH_USER = process.env.REACT_APP_AUTH_USER
    const AUTH_PASS = process.env.REACT_APP_AUTH_PASS

    // functions login, logout
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

            setUser(response.data.user_id) //unsure if I need this?

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
            removeCookie('accessToken', { path: '/' })
            removeCookie('user_id', { path: '/' })
            setIsLoggedIn(false)
        }
    }

    // fetch data and populate
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

    async function getUserDetails(){
        // try {
        //     const response = await axios.get(${BACKEND_API})
        // } catch (error) {
            
        // }
    }

    return (
        <Context.Provider
            value={{
                isLoggedIn,
                games,
                getGames,
                user,
                setUser,
                loginUser,
                logout
            }}>
            {children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }