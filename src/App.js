// src/components/auth/SignupPage.js

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import axios from 'axios';
import { toast } from 'react-toastify';
import { login } from './authStore';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate replaces useHistory in React Router v6
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleFullNameChange = (e) => setFullName(e.target.value);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError('All fields are required');
      return;
    }

    dispatch({ type: 'auth/loading', payload: true });

    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/signup/',
        { email, password, full_name: fullName },
      );

      if (response.status === 201) {
        // Assuming signup API returns 201 Created
        dispatch(
          login({
            full_name: fullName,
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          }),
        );
        toast.success('Signup successful. You are now logged in.');
        navigate('/home'); // Use navigate instead of history.push
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail);
      } else {
        setError('Server error');
      }
    } finally {
      dispatch({ type: 'auth/loading', payload: false });
    }
  };

  return (
    <div className="SignupPage">
      <h3>Signup</h3>
      <Form onSubmit={handleSignup}>
        <Form.Group controlId="formBasicFullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={handleFullNameChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Signup'}
        </Button>
      </Form>
    </div>
  );
};

export default SignupPage;
