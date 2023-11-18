import React, { createContext, useState } from 'react'
import axios from 'axios';

const Context = createContext()

const ContextProvider = ({ children }) => {
    // state
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [games, setGames] = useState(null);

    // other variables
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;

    // functions
    const toggleLogin = () => {
        setIsLoggedIn((prevLoggedIn) => !prevLoggedIn)
    }

    async function getGames() {
        try {
            const response = await axios.get(`${BACKEND_API}/games`, {
                headers: {
                    'Authorization': 'Basic ' + btoa('sofiatruta:Liadan294'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            setGames(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const signUp = async () => {

    }


    // console.log('context', games)
    return (
        <Context.Provider
            value={{
                isLoggedIn,
                toggleLogin,
                games,
                getGames,
                signUp
            }}>
            {children}
        </Context.Provider>
    )
}

export { Context, ContextProvider }