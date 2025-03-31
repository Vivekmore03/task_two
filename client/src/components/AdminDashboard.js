import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getUserFromStorage, removeUserFromStorage } from '../utils/authUtil';
import TaskManagement from './TaskManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [activeSection, setActiveSection] = useState('employees');
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    gender: '',
    domain: '',
    role: ''
  });

  const fetchEmployees = useCallback(async () => {
    try {
      const user = getUserFromStorage();
      
      if (!user) {
        navigate('/admin-login');
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const res = await axios.get('http://localhost:5000/api/employees', config);
      setEmployees(res.data);
      setLoading(false);
      
    } catch (err) {
      toast.error('Error fetching employees data');
      if (err.response?.status === 401) {
        removeUserFromStorage();
        navigate('/admin-login');
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const user = getUserFromStorage();
    
    if (!user) {
      navigate('/admin-login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/employee-dashboard');
      return;
    }
    
    fetchEmployees();
  }, [navigate, fetchEmployees]);

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee);
    setEditFormData({
      name: employee.name,
      email: employee.email,
      gender: employee.gender,
      domain: employee.domain,
      role: employee.role
    });
    setShowEditModal(true);
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
      
      const res = await axios.put(
        `http://localhost:5000/api/employees/${currentEmployee._id}`,
        editFormData,
        config
      );
      
      setEmployees(employees.map(emp => 
        emp._id === currentEmployee._id ? res.data : emp
      ));
      
      setShowEditModal(false);
      toast.success('Employee updated successfully');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating employee');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const user = getUserFromStorage();
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };
        
        await axios.delete(`http://localhost:5000/api/employees/${employeeId}`, config);
        
        setEmployees(employees.filter(emp => emp._id !== employeeId));
        toast.success('Employee deleted successfully');
        
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error deleting employee');
      }
    }
  };

  const handleLogout = () => {
    removeUserFromStorage();
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'employees':
        return (
          <Card className="mb-4">
            <Card.Header as="h2" className="text-center bg-primary text-white">
              Employee Management
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Domain</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.gender}</td>
                      <td>{employee.domain}</td>
                      <td>{employee.role}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(employee)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        );
      case 'tasks':
        return <TaskManagement />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex">
      {/* Sidebar Navigation - Fixed Position */}
      <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh', position: 'fixed', left: 0 }}>
        <div className="text-center py-4 border-bottom border-secondary">
          <h3 className="mb-0">Acrylic Solution</h3>
        </div>
        <Nav className="flex-column p-3">
          <Nav.Link 
            className={`text-white ${activeSection === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveSection('employees')}
            style={{ cursor: 'pointer' }}
          >
            Employee Management
          </Nav.Link>
          <Nav.Link 
            className={`text-white ${activeSection === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveSection('tasks')}
            style={{ cursor: 'pointer' }}
          >
            Task Management
          </Nav.Link>
          <Nav.Link 
            className="text-white mt-auto"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          >
            Logout
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content - Adjusted Margin */}
      <div style={{ marginLeft: '250px', flex: 1, padding: '20px' }}>
        {renderSection()}
      </div>

      {/* Edit Employee Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={editFormData.gender}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Domain</Form.Label>
              <Form.Select
                name="domain"
                value={editFormData.domain}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Domain</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AWS Cloud">AWS Cloud</option>
                <option value="Business Analyst">Business Analyst</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={editFormData.role}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;