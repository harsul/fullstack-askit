import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap"


import { useHistory } from "react-router-dom"
import { AuthContext } from "../helpers/AuthContext"

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let history = useHistory()

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {

      if (response.data.error) {
        alert(response.data.error)
      }
      else {
        localStorage.setItem("accessToken", response.data.token)
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true
        });
        history.push("/")
      }
    });
  };
  return (
    <Container className="mt-5">
      <Row>
        <Col></Col>
        <Col xs={4}>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email"
                onChange={(event) => {
                  setUsername(event.target.value);
                }} />
              <Form.Text className="text-muted text-center">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }} />
            </Form.Group>
            <Form.Group controlId="formBasicSubmit" className="text-center">
              <Button onClick={login} variant="primary" className="round-button">
                Submit
              </Button>
              <hr></hr>
              <Link to="/registration"> Register as new user</Link>
            </Form.Group>
          </Form>
        </Col>

        <Col></Col>
      </Row>

    </Container>
  );
}

export default Login;