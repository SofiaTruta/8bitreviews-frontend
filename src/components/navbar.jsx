import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../context'

const Navbar = () => {
    const { isLoggedIn, toggleLogin } = useContext(Context)

    return (
        <nav>
            <div>
                <h1>8bit reviews</h1>
            </div>

            <div>
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
                            <Link to='/sign-up'><button>Sign Up</button></Link>
                            <button onClick={toggleLogin}>Login</button>
                        </div>
                    )
                }
            </div>
        </nav>
    );
}

export default Navbar;