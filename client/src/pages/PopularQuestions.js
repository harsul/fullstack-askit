import React from "react";
import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { useHistory } from "react-router-dom";
//import FavoriteIcon from '@material-ui/icons/Favorite';
import { AuthContext } from "../helpers/AuthContext";

import { Container, Row, Col, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

import PostClass from "./PostClass";

function Home() {
  const { authState } = useContext(AuthContext);

  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [next, setNext] = useState(10);

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    else {
      getPosts()
    }
    // eslint-disable-next-line
  }, []);

  const getPosts = ()=>{
    axios.get(process.env.REACT_APP_HTTP_API + "/posts", {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then((response) => {
      setListOfPosts(response.data.listOfPosts);
      setLikedPosts(response.data.likedPosts.map((like) => {
        return like.PostId
      }))
    });
  }

  const handleShowMorePosts = () => {
    setNext(next + 10);
  };

  return (
    <Container className="fluid mt-5">
      <Row>
        <Col className="mb-5">
        <h3 className="mb-5">Most popular questions</h3>
        {listOfPosts.sort((a, b) => b.Likes.length - a.Likes.length).slice(0,next).map((post, key) => (
              <PostClass
                key={key}
                post={post}
                authState={authState}
                isLiked={likedPosts.includes(post.id)}
                refresh={getPosts}
              />
            ))}
            {next-10<listOfPosts.length ? 
            <Button className="float-right" variant="primary" onClick={handleShowMorePosts}>Load More</Button>
            : <p className="float-right">End of list</p>}
        </Col>
      </Row>
    </Container>

  );
}

export default Home;