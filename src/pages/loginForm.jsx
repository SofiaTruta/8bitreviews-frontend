import React, { useState, useContext } from 'react'
import { Context } from '../context'
import { useNavigate} from 'react-router-dom'
import Navbar from '../components/navbar'
import { Form, Button } from 'react-bootstrap'


const LoginForm = () => {
    const { loginUser } = useContext(Context)

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        loginUser(formData.username, formData.password)
        navigate(-1)
    };


    return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center mt-5">
                <div className="text-center" style={{ width: '40%' }}>
                    <h3>Login Form</h3>
                    <Form className="custom-dark-mode" onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="outline-secondary" type='submit' className='retro-button mt-2'
                        style={{ borderColor: 'rgb(18, 222, 208)', color: 'rgb(18, 222, 208)'}} >
                            Login
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default LoginForm;