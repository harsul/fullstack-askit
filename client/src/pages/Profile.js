import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

//import FavoriteIcon from '@material-ui/icons/Favorite';

import { Container, Row, Col, Button, Jumbotron } from "react-bootstrap"

import PostClass from "./PostClass";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const { authState } = useContext(AuthContext);
  const [userBasicInfo, setUserBasicInfo] = useState("");

  const [next, setNext] = useState(5);

  useEffect(() => {

    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }

    else {
      axios.get(`${process.env.REACT_APP_HTTP_API}/auth/basicinfo/${id}`).then((response) => {
        setUserBasicInfo(response.data);
      });

      getPosts()
    }
    // eslint-disable-next-line
  }, []);

  const getPosts = () => {
    axios.get(`${process.env.REACT_APP_HTTP_API}/posts/byuserId/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then((response) => {
      setListOfPosts(response.data.listOfPosts.sort((a, b) => b.createdAt - a.createdAt).reverse());
      setLikedPosts(response.data.likedPosts.map((like) => {
        return like.PostId
      }))
    });
  }

  const handleShowMorePosts = () => {
    setNext(next + 10);
  };

  return (
    <div>
      <Jumbotron>
        <Container className="text-center">
          <h1>{userBasicInfo.name} {userBasicInfo.surname}</h1>
          <h2>{userBasicInfo.username}</h2>
          <p>
            This is a place for user information about profile
          </p>
        </Container>
      </Jumbotron>
      <Container className="mt-1">
        <h3 className="mb-5">Questions</h3>
        <Row>
          <Col className="mb-5">
            {console.log(likedPosts)}
          {listOfPosts.slice(0,next).map((post, key) => (
              <PostClass
                key={key}
                post={post}
                authState={authState}
                isLiked={likedPosts.includes(post.id)}
                refresh={getPosts}
              />
            ))}
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