import { Card, DropdownButton, Dropdown, Button } from "react-bootstrap"
import { Link } from "react-router-dom";
import Moment from 'react-moment';
import axios from "axios";
import { useState } from "react";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Formik, Form, Field } from "formik";

export default function Comment({ comment, authState, isLiked, refresh }) {
    const [isEdit, setIsEdit] = useState(false);
    const [commentBody, setCommentBody] = useState(comment.commentBody);

    const handleDeleteComment = () => {
        axios
            .delete(`http://localhost:3001/comments/${comment.id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                refresh()
            });
    };

    const handleLikeAComment = () => {
        axios
            .post(
                process.env.REACT_APP_HTTP_API + "/commentlikes",
                { CommentId: comment.id },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
            .then(() => {
                refresh()
            });
    };

    const handleSubmit = () => {
        axios
            .put(
                process.env.REACT_APP_HTTP_API + "/comments/postcomment",
                {
                    newComment: commentBody,
                    id: comment.id
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                refresh()
                setIsEdit(false)
            });
    };

    return (
        <Card className="mb-3">
            <Card.Header >
                <cite title="Source Title">
                    <Link to={`/profile/${comment.UserId}`}>{comment.username}</Link>
                </cite>
                <br></br>
                <cite><Moment fromNow>{comment.createdAt}</Moment></cite>
                <cite className="float-right">
                    {authState.id === comment.UserId && (
                        <DropdownButton size="sm" id="dropdown-basic-button" title="Options">
                            <Dropdown.Item onClick={() => setIsEdit(true)}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={handleDeleteComment}>Delete</Dropdown.Item>
                        </DropdownButton>
                    )}
                </cite>
            </Card.Header>
            <Card.Body>
                {isEdit
                    ? (
                        <Formik
                            initialValues={{}}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <Field
                                    as="textarea"
                                    rows={3}
                                    className="form-control"
                                    id="inputName"
                                    name="newcomment"
                                    placeholder="Enter name..."
                                    value={commentBody}
                                    onChange={(e) => setCommentBody(e.target.value)}
                                />
                                <div className="form-group text-center">
                                    <br />
                                    <Button type="submit" className="btn btn-primary" disabled={!commentBody.length}>Update</Button>
                                </div>
                            </Form>
                        </Formik>
                    ) : (
                        <blockquote className="blockquote mb-0">
                            <p>
                                {comment.commentBody}
                            </p>
                        </blockquote>
                    )}
            </Card.Body>
            <Card.Footer className="text-muted">
                <label className="ml-2 mr-2">{comment.CommentLikes.length}</label>
                <FavoriteIcon onClick={handleLikeAComment} className={isLiked ? "unlikeBttn" : "likeBttn"} />
            </Card.Footer>
        </Card>
    )
}