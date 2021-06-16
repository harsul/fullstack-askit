import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import { Container, Row, Col, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ChangeUsername() {
    let history = useHistory()
    let { id } = useParams();
    //const [postObject, setPostObject] = useState([]);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");

    const initialValues = {
        name: "",
        surname: "",
        username: "",
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        else {
            axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {

                setName(response.data.name)
                setSurname(response.data.surname)
                setUsername(response.data.username)
            });

        }

        // eslint-disable-next-line
    }, []);


    const onSubmit = (data) => {
        console.log(name, surname, username)
        axios
            .put(
                "http://localhost:3001/auth/changeusername",
                {
                    name: name,
                    surname: surname,
                    username: username
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    history.goBack()
                }
            });
    };
    return (
        <div>
            <Container className="mt-5">
                <h3 className="mb-5">Update Info</h3>
                <Row>
                    <Col></Col>
                    <Col xs={4}>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}>
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <Field
                                        className="form-control"
                                        id="inputName"
                                        name="name"
                                        placeholder="Enter name..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="surname">Surname</label>
                                    <Field
                                        className="form-control"
                                        id="inputSurname"
                                        name="surname"
                                        placeholder="Your Surname..."
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username">Email</label>
                                    <br></br>
                                    <ErrorMessage name="username" component="span" />
                                    <Field
                                        type="email"
                                        className="form-control"
                                        id="inputEmail"
                                        name="username"
                                        placeholder="Your Email..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="form-group text-center">
                                    <Button type="submit" className="btn btn-primary">Update</Button>
                                    <hr></hr>
                                </div>
                            </Form>
                        </Formik></Col>
                    <Col></Col>
                </Row>
            </Container>

        </div>
    )
}
