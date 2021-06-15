import React, { useEffect, useState,useContext } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import axios from "axios";
import Moment from 'react-moment';
import { AuthContext } from "../helpers/AuthContext";

import FavoriteIcon from '@material-ui/icons/Favorite';

import { Container, Row, Col, Card, Button } from "react-bootstrap"

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  const [next, setNext] = useState([]);

  useEffect(() => {

    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    else {
      axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data.sort((a, b) => b.createdAt - a.createdAt).reverse());

      setNext(next+5)
    });

    axios.get("http://localhost:3001/posts", {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then((response) => {
      setLikedPosts(response.data.likedPosts.map((like) => {
        return like.PostId
      }))
    });
    }
    // eslint-disable-next-line
  }, []);

  const handleShowMorePosts = () => {
    setNext(next + 5);
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        // history.push("/");
        window.location.reload()
      });
  };

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
    <Container className="mt-5">
      <h3 className="mb-5">Questions</h3>
      <Row>
        <Col className="mb-5">
          {listOfPosts.slice(0,next).map((value, key) => {
            return (
              <Card key={key} className="mb-3">
                <Card.Header>
                  <Link to={`/profile/${value.UserId}`}> {value.username}</Link>
                  <br></br>
                  <cite title="Source Title"><Moment fromNow>{value.createdAt}</Moment>  </cite>
                  <cite className="float-right">
                    {authState.username === value.username && (
                      <Link to={`/editpost/${value.id}`}>
                        Edit
                      </Link>
                    )}
                    {authState.username === value.username && (
                      <Link onClick={() => {
                        deletePost(value.id);
                      }}> Delete</Link>
                    )}
                  </cite>
                </Card.Header>
                <Card.Body onClick={()=> history.push(`/post/${value.id}`)}>
                  <blockquote className="blockquote mb-0">
                    <p>
                      {value.postText}
                    </p>
                  </blockquote>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <FavoriteIcon size="lg"
                    onClick={() => {
                      likeAPost(value.id);
                    }}
                    className={
                      likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                    }
                  />
                  <Link className="float-right" to={`/post/${value.id}`}>Read Comments</Link>
                  <label> {value.Likes.length}</label>

                </Card.Footer>
              </Card>
            );
          })}
          <Button className="float-right" variant="primary" onClick={handleShowMorePosts}>Load more</Button>
        </Col>
      </Row>

      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}

    </Container>


  );
}

export default Profile;