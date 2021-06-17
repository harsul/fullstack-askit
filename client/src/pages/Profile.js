import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import axios from "axios";
import Moment from 'react-moment';
import { AuthContext } from "../helpers/AuthContext";

import FavoriteIcon from '@material-ui/icons/Favorite';

import { Container, Row, Col, Card, Button, Jumbotron, Dropdown, DropdownButton } from "react-bootstrap"

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const { authState } = useContext(AuthContext);
  const [userBasicInfo, setUserBasicInfo] = useState("");

  const [next, setNext] = useState(0);

  useEffect(() => {

    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    else {
      axios.get(`https://60cb26f67087dbc3e7961a46--pensive-hawking-5c5191.netlify.app/auth/basicinfo/${id}`).then((response) => {
        setUserBasicInfo(response.data);
      });

      axios.get(`https://60cb26f67087dbc3e7961a46--pensive-hawking-5c5191.netlify.app/posts/byuserId/${id}`).then((response) => {
        setListOfPosts(response.data.sort((a, b) => b.createdAt - a.createdAt).reverse());

        setNext(next + 10)
      });

      axios.get("https://60cb26f67087dbc3e7961a46--pensive-hawking-5c5191.netlify.app/posts", {
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
    setNext(next + 10);
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

  const likeAPost = (postId) => {
    axios
      .post(
        "https://60cb26f67087dbc3e7961a46--pensive-hawking-5c5191.netlify.app/likes",
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
    <div>
      <Jumbotron>
        <Container className="text-center">
          <h1>{userBasicInfo.name} {userBasicInfo.surname}</h1>
          <h2>{authState.username}</h2>
          <p>
            This is a place for user information about profile
          </p>
        </Container>
      </Jumbotron>
      <Container className="mt-1">
        <h3 className="mb-5">Questions</h3>
        <Row>
          <Col className="mb-5">
            {listOfPosts.slice(0, next).map((value, key) => {
              return (
                <Card key={key} className="mb-3">
                  <Card.Header>
                    <Link to={`/profile/${value.UserId}`}> {value.username}</Link>
                    <br></br>
                    <cite title="Source Title"><Moment fromNow>{value.createdAt}</Moment>  </cite>
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
                    <label className="mr-2 ml-2"> {value.Likes.length}</label>
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
        </Row>
      </Container>
    </div>
  );
}

export default Profile;