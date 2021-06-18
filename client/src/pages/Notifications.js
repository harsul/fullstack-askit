import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Moment from 'react-moment';


import { Container, Row, Alert, Col, Button  } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Notifications() {
    let history = useHistory();
    const { id } = useParams();

    const [listOfNotifications, setListOfNotifications] = useState([]);

    const [next, setNext] = useState(0);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        else {
            console.log(id)
            axios.get(`${process.env.REACT_APP_HTTP_API}/notifications/byuser/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            }).then((response) => {
                setListOfNotifications(response.data.sort((a, b) => b.createdAt - a.createdAt).reverse());
            });
        }
        setNext(next + 10)
        // eslint-disable-next-line
    }, []);

    const handleShowMorePosts = () => {
        setNext(next + 10);
    };

    return (
        <div>
            <Container className="mt-5">
                <h3>Latest Notifications</h3>
                <Row>

                    <Col>
                        {listOfNotifications.slice(0,next).map((value, key) => {
                            return (
                                <Alert variant="primary">
                                    You have new comments from
                                    <Alert.Link href={`/profile/${value.commentUserId}`}> {value.commentUsername}</Alert.Link> on your
                                    <Alert.Link href={`/post/${value.PostId}`}> post</Alert.Link>. Give it a click if you like.
                                    <cite className="float-right"><Moment fromNow>{value.createdAt}</Moment></cite>
                                </Alert>
                            );
                        })}
                    </Col>
                </Row>
                {next - 10 < listOfNotifications.length ?
                    <Button className="text-center" variant="primary" onClick={handleShowMorePosts}>Load More</Button>
                    : <p className="float-right">End of list</p>}
            </Container>
        </div>
    )
}
