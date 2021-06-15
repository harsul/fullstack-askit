import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Moment from 'react-moment';

import FavoriteIcon from '@material-ui/icons/Favorite';

import { Card, Container, Row, Col, Button, Form, Modal } from "react-bootstrap"

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [listOfComments, setListOfComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const [postText, setPostText] = useState("");
  const [likeNumber, setLikeNumber] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    else {
      axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
        setPostObject(response.data);

        setPostText(response.data.postText)

        setLikeNumber(response.data.Likes.lenght)

        console.log(likeNumber)

      });

      axios.get(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).then((response) => {
        setListOfComments(response.data);
      });

      axios.get("http://localhost:3001/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).then((response) => {
        setListOfPosts(response.data.listOfPosts.sort((a, b) => b.createdAt - a.createdAt).reverse());
        setLikedPosts(response.data.likedPosts.map((like) => {
          return like.PostId
        }))
      });
    }

    // eslint-disable-next-line
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
          UserId: authState.UserId
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
            userId: response.data.id
          };
          setListOfComments([...listOfComments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setListOfComments(
          listOfComments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push("/");
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

  const editpost = (data) => {
    console.log(postText)
    axios
      .put(
        "http://localhost:3001/posts/posttext",
        {
          id: postObject.id,
          postText: postText
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
          console.log("Suceess")
          handleClose()
          window.location.reload();
        }
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card className="mt-5">
            <Card.Header>
              <Link to={`/profile/${postObject.UserId}`}> {postObject.username}</Link>
              <br></br>
              <cite title="Source Title"><Moment fromNow>{postObject.updatedAt}</Moment>  </cite>
              <cite className="float-right">
                {authState.username === postObject.username && (
                  <Button variant="link" onClick={handleShow}>
                    Edit
                  </Button>
                )}
                {authState.username === postObject.username && (
                  <Button variant="link" onClick={() => {
                    deletePost(postObject.id);
                  }}> Delete</Button>
                )}
              </cite>
            </Card.Header>
            <Card.Body>
              <blockquote className="blockquote mb-0">
                <p>
                  {postObject.postText}
                </p>
                {/* <footer className="blockquote-footer">
                  <FavoriteIcon size="lg"
                    onClick={() => {
                      likeAPost(postObject.id);
                    }}
                    className={
                      likedPosts.includes(postObject.id) ? "unlikeBttn" : "likeBttn"
                    }
                  />
                </footer> */}
                <label> {likeNumber}</label>
              </blockquote>
            </Card.Body>
            <Card.Footer className="text-muted">
              <FavoriteIcon size="lg"
                onClick={() => {
                  likeAPost(postObject.id);
                }}
                className={
                  likedPosts.includes(postObject.id) ? "unlikeBttn" : "likeBttn"
                }
              />
              <label>{likeNumber}</label>
            </Card.Footer>
          </Card>
        </Col>

      </Row>
      <Row>
        <Col xs={2}></Col>
        <Col>
          <Form>
            <Form.Group controlId="formBasicComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control type="text" placeholder="Enter comment"
                value={newComment}
                onChange={(event) => {
                  setNewComment(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicSubmit">
              <Button onClick={addComment}> Add Comment</Button>
            </Form.Group>
          </Form>
          <hr></hr>
          {listOfComments.map((comment, key) => {
            return (
              <Card key={key} className="mb-3">
                <Card.Header>
                  <cite title="Source Title"><Link to={`/profile/${comment.UserId}`}>{comment.username}</Link>
                  </cite>
                  <br></br>
                  <cite><Moment fromNow>{comment.createdAt}</Moment></cite>
                  <cite className="float-right">
                    {authState.username === comment.username &&
                      <Button variant="link" href={`/editcomment/${comment.id}`}>Edit</Button>}
                    {authState.username === comment.username &&
                      <Button variant="link" onClick={() => {
                        deleteComment(comment.id);
                      }}>Delete</Button>}
                  </cite>
                </Card.Header>
                <Card.Body>
                  <blockquote className="blockquote mb-0">
                    <p>
                      {comment.commentBody}
                    </p>
                    <footer className="blockquote-footer">
                      {/* <FavoriteIcon
                        onClick={() => {
                          likeAComment(comment.id);
                        }}
                        className={
                          likedComments.includes(comment.id) ? "unlikeBttn" : "likeBttn"
                        }
                      /> */}
                      {/* <label> {value.Likes.length}</label> */}

                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
            );

          })}
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicPost">
              <Form.Label>Post Text</Form.Label>
              <Form.Control
                as="textarea" rows={6}
                placeholder="Edit post"
                value={postText}
                onChange={(event) => {
                  setPostText(event.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editpost}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default Post;