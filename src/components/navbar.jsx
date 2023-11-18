import React, { useContext } from 'react'
import { Context } from '../context'

const Navbar = () => {
    const { isLoggedIn, toggleLogin, signUp } = useContext(Context)

    return (
        <nav>
            <h1>8bit reviews</h1>
            {isLoggedIn ?
                (
                    <div>
                        <button>Register a Game</button>
                        <button>My Games</button>
                        <button>My Reviews</button>
                        <button onClick={toggleLogin}>Logout</button>
                    </div>)
                :
                (
                    <div>
                        <button onClick={signUp}>Sign Up</button>
                        <button onClick={toggleLogin}>Login</button>
                    </div>
                )
            }
        </nav>
    );
}

export default Navbar;