import React, { useState, useContext } from 'react'
import { Context } from '../context'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import { Form, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/dark-mode.css'


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
        navigate('/')
    };


    return (
        <>
            <Navbar />
            <div>Login Form</div>
            <Form className="custom-dark-mode">
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Login
                </Button>
            </Form>
        </>
    );
}

export default LoginForm;