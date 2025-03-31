import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getUserFromStorage, removeUserFromStorage } from '../utils/authUtil';
import TaskList from './TaskList';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    gender: '',
    domain: '',
    password: ''
  });

  const fetchEmployeeData = useCallback(async () => {
    try {
      const user = getUserFromStorage();
      
      if (!user) {
        navigate('/employee-login');
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const res = await axios.get('http://localhost:5000/api/employees/profile', config);
      setEmployee(res.data);
      setLoading(false);
      
    } catch (err) {
      toast.error('Error fetching employee data');
      if (err.response?.status === 401) {
        removeUserFromStorage();
        navigate('/employee-login');
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const user = getUserFromStorage();
    
    if (!user) {
      navigate('/employee-login');
      return;
    }
    
    if (user.role === 'admin') {
      navigate('/admin-dashboard');
      return;
    }
    
    fetchEmployeeData();
  }, [navigate, fetchEmployeeData]);

  const handleEditClick = () => {
    if (employee) {
      setEditFormData({
        name: employee.name,
        email: employee.email,
        gender: employee.gender,
        domain: employee.domain,
        password: ''
      });
      setShowEditModal(true);
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getUserFromStorage();
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const body = JSON.stringify({
        name: editFormData.name,
        email: editFormData.email,
        gender: editFormData.gender,
        domain: editFormData.domain,
        ...(editFormData.password && { password: editFormData.password })
      });
      
      const res = await axios.put('http://localhost:5000/api/employees/profile', body, config);
      
      // Update local storage with new data
      const updatedUser = {
        ...user,
        name: res.data.name,
        email: res.data.email
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setEmployee(res.data);
      setShowEditModal(false);
      toast.success('Profile updated successfully');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        const user = getUserFromStorage();
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        await axios.delete(`http://localhost:5000/api/employees/${user._id}`, config);
        
        removeUserFromStorage();
        toast.success('Account deleted successfully');
        navigate('/');
        
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting account');
      }
    }
  };

  const handleLogout = () => {
    removeUserFromStorage();
    navigate('/');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h2>Employee Dashboard</h2>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Employee Profile Section */}
      <Row className="justify-content-md-center mb-5">
        <Col xs={12} md={8}>
          <Card className="mb-4">
            <Card.Header as="h2" className="text-center bg-primary text-white">
              Employee Dashboard
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <h4>Welcome, {employee?.name}!</h4>
                  <p className="lead">Your Profile Information</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4} className="fw-bold">Name:</Col>
                <Col md={8}>{employee?.name}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={4} className="fw-bold">Email:</Col>
                <Col md={8}>{employee?.email}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={4} className="fw-bold">Gender:</Col>
                <Col md={8}>{employee?.gender}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={4} className="fw-bold">Domain:</Col>
                <Col md={8}>{employee?.domain}</Col>
              </Row>
              
              <div className="d-flex justify-content-between mt-4">
                <Button variant="primary" onClick={handleEditClick}>
                  Edit Profile
                </Button>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tasks Section */}
      <Row className="justify-content-md-center">
        <Col xs={12} md={10}>
          <TaskList />
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="editName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="editEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="editGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={editFormData.gender}
                onChange={handleEditChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="editDomain">
              <Form.Label>Domain</Form.Label>
              <Form.Select
                name="domain"
                value={editFormData.domain}
                onChange={handleEditChange}
                required
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AWS Cloud">AWS Cloud</option>
                <option value="Business Analyst">Business Analyst</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="editPassword">
              <Form.Label>Password (leave blank to keep current)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={editFormData.password}
                onChange={handleEditChange}
                placeholder="Enter new password"
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EmployeeDashboard;