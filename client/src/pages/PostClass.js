import { Card, DropdownButton, Dropdown, Button } from "react-bootstrap"
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import axios from "axios";
import { useState } from "react";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Formik, Form, Field } from "formik";

export default function PostClass({ post, authState, isLiked, refresh }) {
    const [isEdit, setIsEdit] = useState(false);
    const [postText, setPostText] = useState(post.postText);

    const handleDeletePost = () => {
        axios
            .delete(`${process.env.REACT_APP_HTTP_API}/posts/${post.id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                refresh()
            });
    };

    const handleLikeAPost = () => {
        axios
            .post(
                process.env.REACT_APP_HTTP_API + "/likes",
                { PostId: post.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
            .then((response) => {
                refresh()
            })
    };

    const handleSubmit = () => {

        console.log(isLiked)

        axios
            .put(
                process.env.REACT_APP_HTTP_API + "/posts/posttext",
                {
                    postText: postText,
                    id: post.id
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
                    refresh()
                    setIsEdit(false)
                }
            });
    };

    return (
        <Card className="mb-3">
            <Card.Header >
                <cite title="Source Title">
                    <Link to={`/profile/${post.UserId}`}>{post.username}</Link>
                </cite>
                <br></br>
                <cite><Moment fromNow>{post.createdAt}</Moment></cite>
                <cite className="float-right">
                    {authState.id === post.UserId && (
                        <DropdownButton size="sm" id="dropdown-basic-button" title="Options">
                            <Dropdown.Item onClick={() => setIsEdit(true)}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={handleDeletePost}>Delete</Dropdown.Item>
                        </DropdownButton>
                    )}
                </cite>
            </Card.Header>
            <Card.Body>
                {isEdit}
                {isEdit
                    ? (
                        <Formik
                            initialValues={{}}
                            onSubmit={handleSubmit}>
                            <Form>
                                <Field
                                    as="textarea"
                                    rows={3}
                                    className="form-control"
                                    id="inputName"
                                    name="postText"
                                    placeholder="Enter question..."
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)} />
                                <div className="form-group text-center">
                                    <br />
                                    <Button size="sm" type="submit" className="btn btn-primary" disabled={!postText.length}>Update</Button>
                                </div>
                            </Form>
                        </Formik>
                    ) : (
                        <blockquote className="blockquote mb-0">
                            <p>
                                {post.postText}
                            </p>
                        </blockquote>
                    )}
            </Card.Body>

            <Card.Footer className="text-muted">
                <label className="ml-2 mr-2">{post.Likes.length}</label>
                <FavoriteIcon onClick={handleLikeAPost} className={isLiked ? "unlikeBttn" : "likeBttn"} />
                <Link className="float-right" to={`/post/${post.id}`}>Read Comments</Link>
            </Card.Footer>
        </Card>
    )
}