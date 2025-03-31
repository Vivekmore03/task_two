import React, { useState, useEffect } from 'react';
import { Card, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserFromStorage } from '../utils/authUtil';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const user = getUserFromStorage();
      const response = await axios.get('http://localhost:5000/api/tasks/my-tasks', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    if (updating) return;
    
    try {
      setUpdating(true);
      const user = getUserFromStorage();
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/status`,
        { status: newStatus },
        { 
          headers: { 
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update the local state with the response data
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update task status');
      // Refresh tasks to ensure UI is in sync with server
      fetchTasks();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h4>Assigned Tasks</h4>
      </Card.Header>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Short Description</th>
              <th>Long Description</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id}>
                <td>{task.name}</td>
                <td>{task.shortDescription}</td>
                <td>{task.longDescription}</td>
                <td>{new Date(task.deadline).toLocaleString()}</td>
                <td>
                  <Form.Select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="form-select-sm"
                    disabled={updating}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default TaskList; 