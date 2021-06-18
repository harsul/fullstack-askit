import React from "react";
import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Moment from 'react-moment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { AuthContext } from "../helpers/AuthContext";

import { Card, Container, Row, Col, Button, DropdownButton, Dropdown } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const { authState } = useContext(AuthContext);

  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [next, setNext] = useState(0);

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    else {
      axios.get(process.env.REACT_APP_HTTP_API + "/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).then((response) => {
        setListOfPosts(response.data.listOfPosts.sort((a, b) => b.createdAt - a.createdAt).reverse());
        setLikedPosts(response.data.likedPosts.map((like) => {
          return like.PostId
        }))

        setNext(next+10)
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleShowMorePosts = () => {
    setNext(next + 10);
  };

  const handleLikeAPost = (postId) => {
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
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  const handleDeletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
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
        <Col className="mb-5">
        <h3 className="mb-5">Most popular questions</h3>
          {listOfPosts.sort((a, b) => b.Likes.length - a.Likes.length).slice(0,next).map((value, key) => {
            return (
              <Card key={key} className="mb-3">
                <Card.Header>
                  <Link to={`/profile/${value.UserId}`}> {value.username}</Link>
                  <br></br>
                  <cite title="Source Title"><Moment fromNow>{value.updatedAt}</Moment>
                  </cite>
                  <cite className="float-right">
                  {authState.id === value.UserId && (
                        <DropdownButton size="sm" id="dropdown-basic-button" title="Options">
                          <Dropdown.Item href={`/editpost/${value.id}`}>Edit</Dropdown.Item>
                          <Dropdown.Item onClick={() => {
                            handleDeletePost(value.id);
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
                          handleLikeAPost(value.id);
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
            {next-10<listOfPosts.length ? 
            <Button className="float-right" variant="primary" onClick={handleShowMorePosts}>Load More</Button>
            : <p className="float-right">End of list</p>}
        </Col>
      </Row>
    </Container>

  );
}

export default Home;