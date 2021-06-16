import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { Container, Row, Col, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

function CreatePost() {

  let history = useHistory();
  const initialValues = {
  postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    // eslint-disable-next-line
  }, [])

  const validationSchema = Yup.object().shape({
    postText: Yup.string().required("You must input a Question!"),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/posts", data,
      { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
        history.push("/");
      });
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-5">Ask Question</h3>
      <Row>
        <Col></Col>
        <Col xs={8}>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}>
            <Form>
              <div className="form-group">
                <label>Post: </label>
                <br></br>
                <ErrorMessage name="postText" component="span" />
                <Field as="textarea" rows={5}
                  className="form-control"
                  id="inputCreatePost"
                  name="postText"
                  placeholder="Enter Question"
                />
              </div>
              <div className="form-group text-center">
                <Button type="submit"> Create Post</Button>
              </div>
            </Form>
          </Formik>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default CreatePost;