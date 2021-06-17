import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from "formik";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import { Container, Row, Col, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ChangeUsername() {
    let history = useHistory()
    let { id } = useParams();
    //const [postObject, setPostObject] = useState([]);
    const [newText, setNewText] = useState("");

    const initialValues = {
        newText: "",
    };

    useEffect(() => {
        axios.get(`https://60cb26f67087dbc3e7961a46--pensive-hawking-5c5191.netlify.app/posts/byId/${id}`).then((response) => {

            setNewText(response.data.postText)

        });
        // eslint-disable-next-line
    }, []);


    const onSubmit = (data) => {
        axios
            .put(
                "https://60cb26f67087dbc3e7961a46--pensive-hawking-5c5191.netlify.app/posts/posttext",
                {
                    postText: newText,
                    id: id
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
                <h3 className="mb-5">Update</h3>
                <Row>
                    <Col></Col>
                    <Col xs={6}>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                        >
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="name">Edit Post {id}</label>
                                    <Field
                                        as="textarea" rows={3}
                                        className="form-control"
                                        id="inputName"
                                        name="newcomment"
                                        placeholder="Enter name..."
                                        value={newText}
                                        onChange={(e) => setNewText(e.target.value)}
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
