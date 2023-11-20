import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../context'
import { useNavigate } from 'react-router-dom'


const Navbar = () => {
    const { isLoggedIn, logout, userDetails, checkIfLoggedIn } = useContext(Context)

    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    useEffect(()=>{
        checkIfLoggedIn()
    },[])

    return (
        <nav>
            <div>
            <Link to='/' className="link-unstyled"><h1>8bit reviews</h1></Link>
            </div>

            <div>
                {isLoggedIn  ?
                    (
                        <div>
                            <p>Hi {userDetails.first_name}</p>
                            <Link to='/register-game'><button>Register a Game</button></Link>
                            <Link to='/profile'><button>My Profile</button></Link>
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