import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterForm = () => {
  // used to navigate between components
  const navigate = useNavigate();
  // set the state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    setError(""); // Clear error when input changes
  };

  const { first_name, last_name, email, password, password2 } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    if (!first_name || !last_name || !email || !password || !password2) {
      //throw an error
      setError("All fields are required");
    } else if (password !== password2) {
      setError("Passwords don't match. Try again!");
    } else {
      // make call to api
      try {
        console.log(formData);
        const res = await axios.post(
          "http://localhost:8000/api/auth/register/",
          formData
        );
        //check our response
        const response = res.data;
        // user created successfully
        if (res.status === 201) {
          //redirect to verifyemail
          navigate("/verify-email");
          toast.success(response.message);
        }
      } catch (err) {
        if (err.response && err.response.data) {
          // Django validation error messages will be in err.response.data
          // You might need to adjust this depending on the exact structure of your error messages
          if (err.response.data.email) {
            setError(err.response.data.email[0]);
          } else if (err.response.data.password) {
            setError(err.response.data.password[0]);
          } else if (err.response.data.password2) {
            setError(err.response.data.password2[0]);
          }
        } else {
          setError("Server Error. Please try again later.");
        }

        //   //server error pass to error
        //  // setError("Server Error. Please try again later.");
        //   console.log(Object.values(err.response.request.responseText));

        //  console.log(err.response.request.responseText);
        //  //setError(err.response.request.responseText);
        // }
      }
    }
  };

  return (
    <Container className="registerForm-container">
      <Row className="justify-content-md-end">
        <Col xs={25} md={30}>
          <div className="registerForm-create-account">
            <h4>Create your account now:</h4>
            <p style={{ color: "red" }}>{error ? error : ""}</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Label className="registerForm-required-label">
                First Name:
              </Form.Label>
              <Form.Control
                className="registerForm-required-control"
                type="text"
                placeholder="Enter your first name"
                name="first_name"
                value={first_name}
                onChange={handleChange}
                required // Add required attribute
              />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label className="registerForm-required-label">
                Last Name:
              </Form.Label>
              <Form.Control
                className="registerForm-required-control"
                type="text"
                placeholder="Enter your first name"
                name="last_name"
                value={last_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label
                className="registerForm-required-label"
                id="registerForm-email"
              >
                Email address:
              </Form.Label>
              <Form.Control
                className="registerForm-required-control"
                type="email"
                placeholder="Enter email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label className="registerForm-required-label">
                Password:
              </Form.Label>
              <Form.Control
                className="registerForm-required-control"
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formRepeatPassword">
              <Form.Label
                className="registerForm-required-label"
                id="registerForm-repeatpassword"
              >
                Repeat Password:
              </Form.Label>
              <Form.Control
                className="registerForm-required-control"
                type="password"
                placeholder="Repeat Password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>

            <a href="/terms" className="registerForm-terms-link">
              By signing up you agree to the terms and conditions.
            </a>

            <Button
              className="registerForm-signup-button"
              variant="primary"
              type="submit"
            >
              Sign Up
            </Button>

            <div className="registerForm-haveAccount-container">
              <p className="registerForm-haveAccount">
                Already have an account ?
                <a href="/login" className="registerForm-login-link">
                  Login
                </a>
              </p>
            </div>
          </Form>
          <h3>Or </h3>
          <div className="registerForm-GoogleContainer">
            <Button
              className="registerForm-signup-google-button"
              variant="primary"
              type="submit"
            >
              Sign Up with Google
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
