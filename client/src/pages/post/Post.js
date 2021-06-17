import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import Moment from 'react-moment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Card, Container, Row, Col, Button, Form, Modal, DropdownButton, Dropdown } from "react-bootstrap"


import { AuthContext } from "../../helpers/AuthContext";
import Comment from "./Comment";

function Post() {
  let { id } = useParams();
  let history = useHistory();

  const [postObject, setPostObject] = useState({});
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likeNum, setLikeNum] = useState("");

  const [listOfComments, setListOfComments] = useState([]);
  const [likedComments, setLikedComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  const [postText, setPostText] = useState("");
  const [postUserId, setPostUserId] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    else {
      axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
        setPostObject(response.data);

        setPostText(response.data.postText)
        setPostUserId(response.data.UserId)

        setLikeNum(response.data.Likes.length)
      });

      getPostComment()

      axios.get(process.env.REACT_APP_HTTP_API + "/posts", {
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

  const getPostComment = () => {
    axios.get(`http://localhost:3001/comments/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then((response) => {
      setListOfComments(response.data.listOfComments);
      setLikedComments(response.data.likedComments.map((like) => {
        return like.CommentId
      }))
    });
  }

  const addComment = () => {
    axios
      .post(
        process.env.REACT_APP_HTTP_API + "/comments",
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
          getPostComment();
          setNewComment("");
        }
      });

    axios
      .post(
        process.env.REACT_APP_HTTP_API + "/notifications",
        {
          PostId: id,
          UserId: postUserId,
          read: "0"
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
          console.log("Success")
        }
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
        process.env.REACT_APP_HTTP_API + "/likes",
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
          setLikeNum(likeNum - 1)
        } else {
          setLikedPosts([...likedPosts, postId]);
          setLikeNum(likeNum + 1)
        }
      });
  };

  const editpost = (data) => {
    console.log(postText)
    axios
      .put(
        process.env.REACT_APP_HTTP_API + "/posts/posttext",
        {
          id: postObject.id,
          postText: postText
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
        else {
          axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
          });
          console.log("Suceess")
          handleClose()
        }
      });
  };

  return (
    <div>
      <Container className="mb-5">
        <Row>
          <Col>
            <Card className="mt-5">
              <Card.Header >
                <Link to={`/profile/${postObject.UserId}`}> {postObject.username}</Link>
                <br></br>
                <cite title="Source Title"><Moment fromNow>{postObject.updatedAt}</Moment>  </cite>
                <cite className="float-right">
                  {authState.id === postObject.UserId && (
                    <DropdownButton size="sm" id="dropdown-basic-button" title="Options">
                      <Dropdown.Item onClick={handleShow}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => {
                        deletePost(postObject.id);
                      }}>Delete</Dropdown.Item>
                    </DropdownButton>
                  )}
                </cite>
              </Card.Header>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>
                    {postObject.postText}
                  </p>
                </blockquote>
              </Card.Body>
              <Card.Footer className="text-muted">
                <label className="ml-2 mr-2">{likeNum}</label>
                <FavoriteIcon
                  onClick={() => {
                    likeAPost(postObject.id);
                  }}
                  className={
                    likedPosts.includes(postObject.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={2}></Col>
          <Col>
            <Form onSubmit={(event) => event.preventDefault()}>
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
            <hr />
            {listOfComments.map((comment, key) => (
              <Comment
                key={key}
                comment={comment}
                authState={authState}
                isLiked={likedComments.includes(comment.id)}
                refresh={getPostComment}
              />
            ))}
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
                  as="textarea" rows={5}
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
    </div>

  );
}

export default Post;