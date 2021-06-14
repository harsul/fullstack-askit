import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Moment from 'react-moment';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { Card, Container, Row, Col, ListGroup } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    else {
      axios.get("http://localhost:3001/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).then((response) => {
        setListOfPosts(response.data.listOfPosts.sort((a, b) => b.createdAt - a.createdAt).reverse());
        setLikedPosts(response.data.likedPosts.map((like) => {
          return like.PostId
        }))
      });

      axios.get("http://localhost:3001/auth").then((response) => {
        setListOfUsers(response.data)
        console.log(response.data)
      });

    }
    // eslint-disable-next-line
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <Container className="fluid mt-5">
      <Row>
        <Col xs={6}>
          <h3 className="mb-5">Latest questions</h3>
          {listOfPosts.map((value, key) => {
            return (
              <Card key={key} className="mb-3">
                <Card.Header>
                  <Link to={`/profile/${value.UserId}`}> {value.username}</Link>
                  <br></br>
                  <cite title="Source Title"><Moment fromNow>{value.updatedAt}</Moment>
                  </cite>
                </Card.Header>
                <Card.Body onClick={() => history.push(`/post/${value.id}`)}>
                  <blockquote className="blockquote mb-0">
                    <p>
                      {value.postText}
                    </p>
                  </blockquote>
                </Card.Body>
                <Card.Footer className="text-muted">

                  <label className="ml-2 mr-2"> {value.Likes.length}</label>

                  {/* <Button onClick={() => {
                    likeAPost(value.id);
                  }}
                    size="sm"
                    variant={
                      likedPosts.includes(value.id) ? "danger" : "outline-danger"
                    }>{likedPosts.includes(value.id) ? "Dislike" : "Like"}</Button> */}

                  <FavoriteIcon 
                        onClick={() => {
                          likeAPost(value.id);
                        }}
                        className={
                          likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                        }
                      />
                  <Link className="float-right" to={`/post/${value.id}`}>Read Comments</Link>

                </Card.Footer>
              </Card>
            );
          })}
        </Col>
        <Col xs="6">
        <h3 className="mb-5">Most active users</h3>
          <ListGroup>
          {listOfUsers.slice(0,5).sort((a, b) => b.Comments.length - a.Comments.length).map((value, key) => {
            return (
              <ListGroup.Item key={key}> <Link to={`/profile/${value.UserId}`}> {value.name} {value.surname} - {value.username}</Link> </ListGroup.Item>
            );
          })}
          </ListGroup>
          <hr></hr>
          <h3 className="mb-5">Most popular questions</h3>
          {listOfPosts.slice(0,5).sort((a, b) => b.Likes.length - a.Likes.length).map((value, key) => {
            return (
              <Card key={key} className="mb-3">
                <Card.Header>
                  <Link to={`/profile/${value.UserId}`}> {value.username}</Link>
                  <br></br>
                  <cite title="Source Title"><Moment fromNow>{value.updatedAt}</Moment>
                  </cite>
                </Card.Header>
                <Card.Body onClick={() => history.push(`/post/${value.id}`)}>
                  <blockquote className="blockquote mb-0">
                    <p>
                      {value.postText}
                    </p>
                  </blockquote>
                </Card.Body>
                <Card.Footer className="text-muted">

                  <label className="ml-2 mr-2"> {value.Likes.length}</label>

                  {/* <Button onClick={() => {
                    likeAPost(value.id);
                  }}
                    size="sm"
                    variant={
                      likedPosts.includes(value.id) ? "danger" : "outline-danger"
                    }>{likedPosts.includes(value.id) ? "Dislike" : "Like"}</Button> */}

                  <FavoriteIcon 
                        onClick={() => {
                          likeAPost(value.id);
                        }}
                        className={
                          likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                        }
                      />
                  <Link className="float-right" to={`/post/${value.id}`}>Read Comments</Link>

                </Card.Footer>
              </Card>
            );
          })}
          <hr></hr>

        </Col>
      </Row>
    </Container>

  );
}

export default Home;