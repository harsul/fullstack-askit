import React from "react";
import axios from "axios";
import { useEffect, useState, useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import Moment from 'react-moment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { AuthContext } from "../helpers/AuthContext";

import { Card, Container, Row, Col, ListGroup, Button, Dropdown, DropdownButton } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';


function Home() {

  const { authState } = useContext(AuthContext);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [listOfBestPosts, setListOfBestPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [next, setNext] = useState(0);

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
        setListOfBestPosts(response.data.listOfBestPosts.sort((a, b) => b.Likes.length - a.Likes.length));
        setLikedPosts(response.data.likedPosts.map((like) => {
          return like.PostId
        }))

        setNext(next + 20);
      });

      axios.get("http://localhost:3001/auth").then((response) => {
        setListOfUsers(response.data)
        console.log(response.data)
      })
    }
    // eslint-disable-next-line
  }, []);

  const handleShowMorePosts = () => {
    setNext(next + 10);
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

        setListOfBestPosts(listOfPosts.sort((a, b) => b.Likes.length - a.Likes.length));

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

  const deletePost = (id) => {
    axios
      .delete(`https://60cb26f67087dbc3e7961a46--pensive-hawking-5c5191.netlify.app/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setListOfPosts(
          listOfPosts.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  return (
    <Container className="fluid mt-5">
      <Row>
        <Col xs={6} className="mb-5">
          <h3 className="mb-5">Latest questions</h3>
          {listOfPosts.slice(0, next).map((value, key) => {
            return (
              <Card key={key} className="mb-3">
                <Card.Header>
                  <Link to={`/profile/${value.UserId}`}> {value.username}</Link>
                  <br></br>
                  <cite title="Source Title"><Moment fromNow>{value.updatedAt}</Moment>
                  </cite>
                  <cite className="float-right">
                  {authState.username === value.username && (
                        <DropdownButton size="sm" id="dropdown-basic-button" title="Options">
                          <Dropdown.Item href={`/editpost/${value.id}`}>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => {
                            deletePost(value.id);
                          }}>Delete</Dropdown.Item>
                        </DropdownButton>
                      )}

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
          {next - 10 < listOfPosts.length ?
            <Button className="float-right" variant="primary" onClick={handleShowMorePosts}>Load More</Button>
            : <p className="float-right">End of list</p>}

        </Col>
        <Col xs="6">
        <h3 className="mb-5">Best Questions</h3>
        <ListGroup>
            {listOfBestPosts.sort((a, b) => b.Likes.length - a.Likes.length).slice(0, 10).map((value, key) => {
              return (
                <ListGroup.Item key={key} onClick={() => history.push(`/post/${value.id}`)}>
                  <p>{value.postText}</p>
                  <cite className="float-right">Likes: {value.Likes.length} </cite> </ListGroup.Item>
              );
            })}
          </ListGroup>
          <hr></hr>

          <h3 className="mb-5">Most active users</h3>
          <ListGroup>
            {listOfUsers.sort((a, b) => b.Comments.length - a.Comments.length).slice(0, 10).map((value, key) => {
              return (
                <ListGroup.Item key={key}>
                  <Link to={`/profile/${value.id}`}> {value.name} {value.surname}</Link>
                  <cite className="float-right">Comments: {value.Comments.length} </cite> </ListGroup.Item>
              );
            })}
          </ListGroup>
          <hr></hr>
          
          {/* {listOfBestPosts.slice(0, 5).map((value, key) => {
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
          })} */}

        </Col>
      </Row>
    </Container>

  );
}

export default Home;