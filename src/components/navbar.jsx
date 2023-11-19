import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../context'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { isLoggedIn, logout, user } = useContext(Context)

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/hello')
    }

    return (
        <nav>
            <div>
                <h1>8bit reviews</h1>
            </div>

            <div>
                {isLoggedIn ?
                    (
                        <div>
                            <p>Hi {user}</p>
                            <button>Register a Game</button>
                            <button>My Games</button>
                            <button>My Reviews</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>)
                    :
                    (
                        <div>
                            <Link to='/sign-up'><button>Sign Up</button></Link>
                            <Link to='/login'><button>Login</button></Link>
                        </div>
                    )
                }
            </div>
        </nav>
    );
}

export default Navbar;