import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory, Link } from "react-router-dom"

import { Container,Row,Col, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

function Registration() {
  let history = useHistory()

  const initialValues = {
    name: "",
    surname: "",
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(5).required('Required'),
  });

  const onSubmit = (data) => {
    axios.post("https://60cb26f67087dbc3e7961a46--pensive-hawking-5c5191.netlify.app/auth", data).then(() => {
      console.log(data);
      history.push("/")
    });
  };

  return (

    <Container className="mt-5">
      <Row>
        <Col></Col>
        <Col xs={4}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}>
            <Form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field
                  className="form-control"
                  id="inputName"
                  name="name"
                  placeholder="Enter name..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="surname">Surname</label>
                <Field
                  className="form-control"
                  id="inputSurname"
                  name="surname"
                  placeholder="Your Surname..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Email</label>
                <br></br>
                <ErrorMessage name="username" component="span" />

                <Field
                  className="form-control"
                  id="inputEmail"
                  name="username"
                  placeholder="Your Email..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <br></br>
                <ErrorMessage name="password" component="span" />
                <Field
                  className="form-control"
                  type="password"
                  id="inputPassword"
                  name="password"
                  placeholder="Your Password..."
                />
              </div>
              <div className="form-group text-center">
                <Button type="submit" className="btn btn-primary">Register</Button>
                <hr></hr>
                <Link to="/login"> Already an user</Link>
              </div>

            </Form>
          </Formik></Col>
        <Col></Col>
      </Row>

    </Container>
  );
}

export default Registration;