import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import {  useHistory, useParams } from "react-router-dom";


import { Container, Row, Alert, Col } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Notifications() {
    let history = useHistory();
    const { id } = useParams();

    const [listOfNotifications, setListOfNotifications] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        else {
            console.log(id)
            axios.get(`http://localhost:3001/notifications/byuser/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            }).then((response) => {
                setListOfNotifications(response.data);
            });
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <Container className="mt-5">
            <h2>Latest Notifications</h2>
                <Row>
                    
                    <Col>
                        {listOfNotifications.map((value, key) => {
                            return (
                                <Alert variant="primary">
                                    You have new comments from 
                                    <Alert.Link href={`/profile/${value.commentUserId}`}> {value.commentUsername}</Alert.Link> on your
                                    <Alert.Link href={`/post/${value.postId}`}> post</Alert.Link>. Give it a click if you like.
                                </Alert>
                            );
                        })}
                    </Col>
                </Row>
            </Container>
            <hr></hr>
            <Container>
                <Row>
                    Read
                </Row>
            </Container>
        </div>
    )
}
