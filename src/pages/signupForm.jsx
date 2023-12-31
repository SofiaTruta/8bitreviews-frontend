import React, { useContext, useState } from 'react';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Navbar from "../components/navbar";
import { Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css'


const SignUpForm = () => {
    const { BACKEND_API } = useContext(Context);
    const navigate = useNavigate()

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

        try { // eslint-disable-next-line no-unused-vars
            const signup = await axios.post(`${BACKEND_API}/new-user/`, postData)
            navigate('/login', { replace: true })

        } catch (error) {
            alert("An error occurred while processing your request. Please make sure you have entered a valid username.");
            console.log(error)
        }
    }

    return (
        <>
            <Navbar />
            <Row className="justify-content-center my-4">
                <Col xs={6}>
                    <h2 className="text-center">Sign Up Form</h2>
                    <p className="text-center mb-4">*all fields are mandatory</p>
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

                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <Button variant="outline-secondary" className='retro-button mt-2'
                                    style={{ borderColor: 'rgb(18, 222, 208)', color: 'rgb(18, 222, 208)'}} type="submit">
                                    Sign Up
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </>

    );
}

export default SignUpForm;