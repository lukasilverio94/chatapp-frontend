import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap"; // Added Container here
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    dispatch({ type: "auth/loading", payload: true });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login/",
        { email, password }
      );

      if (response.status === 200) {
        dispatch(
          login({
            full_name: response.data.full_name,
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          })
        );
        toast.success("Login successful");
        navigate("/home"); // Redirect to home page after successful login
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail);
      } else {
        setError("Server error");
      }
    } finally {
      dispatch({ type: "auth/loading", payload: false });
    }
  };

  return (
    <Container>
      <h3>Login</h3>
      <Form onSubmit={handleLogin}>
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
          {loading ? "Loading..." : "Login"}
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
