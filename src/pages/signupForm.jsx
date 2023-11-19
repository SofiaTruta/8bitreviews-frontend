import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Navbar from "../components/navbar";
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dark-mode.css'

const SignUpForm = () => {
    const { user, setUser, toggleLogin } = useContext(Context);
    const navigate = useNavigate()
    const login = {
        pathname: '/login'
    }

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        first_name: '',
        last_name: ''
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!")
            return
        }

        const { confirmPassword, ...postData } = formData

        try {
            const signup = await axios.post('http://localhost:8000/new-user/', postData)
            setUser(signup.data.user_data)
            navigate(login)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // toggleLogin()
    }, [user])
    return (
        <>
            <Navbar />
            <div>Sign Up Form</div>
            <Form onSubmit={handleSubmit}>
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

                <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Sign Up
                </Button>
            </Form>
        </>

    );
}

export default SignUpForm;