import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import EditPost from "./pages/EditPost";
import EditComment from "./pages/EditComment";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PopularQuestions from "./pages/PopularQuestions";
import ChangePassword from "./pages/ChangePassword";
import ChangeUsername from "./pages/ChangeUsername";
import Notifications from "./pages/Notifications";
// import { useHistory } from "react-router-dom";

import PageNotFound from "./pages/PageNotFound";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown,Container } from 'react-bootstrap';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  // let history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    window.location.reload();
  };

  return (
    <div className="font">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" >
            <Container>
            <Navbar.Brand href="/">ASK IT</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                {authState.status ? (
                  <>
                    <Nav.Link className="text-white" href="/">Home Page</Nav.Link>
                    <Nav.Link className="text-white" href="/popularquestions">Popular Questions</Nav.Link>
                    <Nav.Link className="text-white" href="/createpost">Ask Question</Nav.Link>
                  </>
                ) : (<Nav.Link>The best platform for your questions</Nav.Link>)}
              </Nav>
              <Nav>
                {authState.status &&
                  <NavDropdown className="text-white" title="My Profile" id="collasible-nav-dropdown">
                    <NavDropdown.Item href={`/notifications/${authState.id}`}>Notifications</NavDropdown.Item>
                    <NavDropdown.Item href={`/profile/${authState.id}`}>My Questions</NavDropdown.Item>
                    
                    <NavDropdown.Divider />
                    <NavDropdown.Item href={`/changeusername/${authState.id}`}>Edit Profile</NavDropdown.Item>
                    <NavDropdown.Item href={`/changepassword`}>Change Password</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                }
              </Nav>
            </Navbar.Collapse>

            </Container>
            
          </Navbar>

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/createpost" exact component={CreatePost} />
            <Route path="/post/:id" exact component={Post} />
            <Route path="/editpost/:id" exact component={EditPost} />
            <Route path="/editcomment/:id" exact component={EditComment} />
            <Route path="/registration" exact component={Registration} />
            <Route path="/login" exact component={Login} />
            <Route path="/popularquestions" exact component={PopularQuestions} />
            <Route path="/profile/:id" exact component={Profile} />
            <Route path="/notifications/:id" exact component={Notifications} />
            <Route path="/changepassword" exact component={ChangePassword} />
            <Route path="/changeusername/:id" exact component={ChangeUsername} />
            <Route path="/*" exact component={PageNotFound} />

          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;