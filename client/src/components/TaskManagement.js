import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserFromStorage } from '../utils/authUtil';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    deadline: '',
    assignedTo: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const user = getUserFromStorage();
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const fetchEmployees = async () => {
    try {
      const user = getUserFromStorage();
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = getUserFromStorage();
      await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Task assigned successfully');
      setFormData({
        name: '',
        shortDescription: '',
        longDescription: '',
        deadline: '',
        assignedTo: ''
      });
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const user = getUserFromStorage();
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h4>Assign New Task</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Short Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Long Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Deadline</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={onChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Assign To</Form.Label>
                  <Form.Select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Assigning...' : 'Assign Task'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4>Assigned Tasks</h4>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Assigned To</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task._id}>
                      <td>{task.name}</td>
                      <td>{task.assignedTo.name}</td>
                      <td>{new Date(task.deadline).toLocaleString()}</td>
                      <td>{task.status}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(task._id)}
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
        </Col>
      </Row>
    </Container>
  );
};

export default TaskManagement; 