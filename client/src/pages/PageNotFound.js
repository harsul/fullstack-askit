
import React from "react";
import { Link } from "react-router-dom";
import {Container} from "react-bootstrap"

function PageNotFound() {
  return (
    <Container className="text-center mt-4">
      <div>
        <h1>Page Not Found - 404 </h1>
        <h3>
          Go to the <Link to="/"> Home Page</Link>
        </h3>
      </div>
    </Container>

  );
}

export default PageNotFound;