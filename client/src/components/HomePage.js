import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container>
      <Row className="text-center mb-4">
        <Col>
          <h1 className="my-4">Employee Management System</h1>
          <p className="lead">
            Acrylic Solutions is a leading company in Nashik providing IT solutions
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Employee Registration</Card.Title>
              <Card.Text>
                Register as a new employee to join the system
              </Card.Text>
              <Link to="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Employee Login</Card.Title>
              <Card.Text>
                Login to access your employee dashboard
              </Card.Text>
              <Link to="/employee-login">
                <Button variant="success">Login</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Admin Login</Card.Title>
              <Card.Text>
                Admin portal to manage all employee data
              </Card.Text>
              <Link to="/admin-login">
                <Button variant="danger">Admin Login</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;