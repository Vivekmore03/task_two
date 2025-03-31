const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllTasks,
  getEmployeeTasks,
  createTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');

// Admin routes
router.get('/', protect, admin, getAllTasks);
router.post('/', protect, admin, createTask);
router.delete('/:id', protect, admin, deleteTask);

// Employee routes
router.get('/my-tasks', protect, getEmployeeTasks);
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router; 