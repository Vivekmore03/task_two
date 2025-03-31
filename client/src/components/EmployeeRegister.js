import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getUserFromStorage, setUserInStorage } from '../utils/authUtil';

const EmployeeRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    domain: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [loading, setLoading] = useState(false);
  
  const { name, email, gender, domain, password, confirmPassword, role } = formData;
  
  useEffect(() => {
    // If user is already logged in, redirect
    const user = getUserFromStorage();
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/employee-dashboard');
      }
    }
  }, [navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const body = JSON.stringify({
        name,
        email,
        gender,
        domain,
        password,
        role
      });
      
      const res = await axios.post('http://localhost:5000/api/employees/register', body, config);
      
      if (res.data.token) {
        setUserInStorage(res.data);
        toast.success('Registration successful');
        
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      } else {
        toast.error('Registration failed: No token received');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={6}>
        <Card className="p-4">
          <h2 className="text-center mb-4">Employee Registration</h2>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={gender}
                onChange={onChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="domain">
              <Form.Label>Domain</Form.Label>
              <Form.Select
                name="domain"
                value={domain}
                onChange={onChange}
                required
              >
                <option value="">Select Domain</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AWS Cloud">AWS Cloud</option>
                <option value="Business Analyst">Business Analyst</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={role}
                onChange={onChange}
                required
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
              Register
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default EmployeeRegister;