const express = require('express');
const router = express.Router();
const {
  registerEmployee,
  loginEmployee,
  getEmployeeProfile,
  updateEmployeeProfile,
  getEmployees,
  deleteEmployee,
  getEmployeeById,
  updateEmployee,
} = require('../controllers/employeeController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerEmployee);
router.post('/login', loginEmployee);

// Protected routes
router.route('/profile')
  .get(protect, getEmployeeProfile)
  .put(protect, updateEmployeeProfile);

// Admin routes
router.route('/')
  .get(protect, admin, getEmployees);

router.route('/:id')
  .delete(protect, admin, deleteEmployee)
  .get(protect, admin, getEmployeeById)
  .put(protect, admin, updateEmployee);

module.exports = router;