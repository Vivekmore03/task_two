import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { getUserFromStorage, removeUserFromStorage } from '../utils/authUtil';

const NavBar = () => {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const logoutHandler = () => {
    removeUserFromStorage();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">
          Acrylic Solutions
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to={user.role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'}>
                  Dashboard
                </Nav.Link>
                <Button variant="outline-light" onClick={logoutHandler}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/employee-login">Employee Login</Nav.Link>
                <Nav.Link as={Link} to="/admin-login">Admin Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;