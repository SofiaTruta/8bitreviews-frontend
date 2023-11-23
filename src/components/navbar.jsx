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
    }, [])

    return (
        <nav>
            <div>
                <Link to='/' className="link-unstyled" style={{ fontFamily: 'Silkscreen, sans-serif' }}>
                    <h1>8bit reviews</h1>
                </Link>
            </div>

            <div className='nav-buttons'>
                {isLoggedIn && userDetails ?
                    (
                        <div className='user-info'>
                            <div className='user-buttons'>
                                <Link to='/search-api'><Button variant="outline-secondary" className='retro-button'>Register a Game</Button></Link>
                                <Link to='/profile'><Button variant="outline-secondary" className=' retro-button mx-3'>My Profile</Button></Link>
                                <Button onClick={handleLogout} variant="outline-secondary" className='retro-button'>Logout</Button>
                            </div>
                        </div>
                    ) : (
                        <div className='guest-buttons'>
                            <Link to='/login'><Button variant="outline-secondary" className='retro-button'>Login</Button></Link>
                        </div>
                    )
                }
            </div>
        </nav>
    );
}

export default Navbar;