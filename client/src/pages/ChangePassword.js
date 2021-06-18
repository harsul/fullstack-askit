import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"
import { Form, Button, Container, Row, Col } from "react-bootstrap"

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  let history = useHistory()

  const handleChangePassword = () => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    else {
      axios
      .put(
        process.env.REACT_APP_HTTP_API + "/auth/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
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
          history.goBack()
        }
      });
    }
  };

  return (

    <Container className="mt-5">
      <h3 className="mb-5">Change Password</h3>
      <Row>
        <Col></Col>
        <Col xs={4}>
          <Form>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control type="password" placeholder="Old Password"
                onChange={(event) => {
                  setOldPassword(event.target.value);
                }} />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <br />
              {newPassword.length<5 && <span>New password must be greater than 5 characters</span>}
              <Form.Control type="password" placeholder="New Password"
                onChange={(event) => {
                  setNewPassword(event.target.value);
                }} />
            </Form.Group>
            <Form.Group controlId="formBasicSubmit" className="text-center">
              <Button onClick={handleChangePassword} disabled={newPassword.length<5}> Save Changes</Button>
            </Form.Group>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default ChangePassword;