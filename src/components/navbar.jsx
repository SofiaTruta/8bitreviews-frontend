import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../context'
import { useNavigate } from 'react-router-dom'

import { Button } from 'react-bootstrap'

const Navbar = () => {
    const { isLoggedIn, logout, userDetails, checkIfLoggedIn } = useContext(Context)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    
    useEffect(() => {
        checkIfLoggedIn()
        // eslint-disable-next-line 
    },[]) 

    return (
        <nav>
            <div className='logo'>
                <Link to='/' className="link-unstyled"><h1>8bit reviews</h1></Link>
            </div>

            <div className='nav-buttons'>
                {isLoggedIn ?
                    (
                        <div className='user-info'>
                            <p>Hi {userDetails.first_name}</p>
                            <div className='user-buttons'>
                                <Link to='/register-game'><Button className=''>Register a Game</Button></Link>
                                <Link to='/profile'><Button className='mx-3'>My Profile</Button></Link>
                                <Button onClick={handleLogout} className=''>Logout</Button>
                            </div>
                        </div>
                    ) : (
                        <div className='guest-buttons'>
                            <Link to='/sign-up'><Button>Sign Up</Button></Link>
                            <Link to='/login'><Button>Login</Button></Link>
                        </div>
                    )
                }
            </div>
        </nav>
    );
}

export default Navbar;