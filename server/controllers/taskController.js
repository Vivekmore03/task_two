const Task = require('../models/Task');
const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');

// @desc    Get all tasks (admin only)
// @route   GET /api/tasks
// @access  Private/Admin
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find()
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
  res.json(tasks);
});

// @desc    Get employee tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
const getEmployeeTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.employee._id })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
  res.json(tasks);
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = asyncHandler(async (req, res) => {
  const { name, shortDescription, longDescription, deadline, assignedTo } = req.body;

  if (!name || !shortDescription || !longDescription || !deadline || !assignedTo) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const assignedEmployee = await Employee.findById(assignedTo);
  if (!assignedEmployee) {
    res.status(404);
    throw new Error('Assigned employee not found');
  }

  const task = await Task.create({
    name,
    shortDescription,
    longDescription,
    deadline,
    assignedTo,
    createdBy: req.employee._id,
    status: 'Not Started'
  });

  res.status(201).json(task);
});

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if the user is either the assigned employee or an admin
  if (task.assignedTo.toString() !== req.employee._id.toString() && req.employee.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const { status } = req.body;

  if (!['Not Started', 'In Progress', 'Completed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  task.status = status;
  await task.save();

  res.json(task);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.remove();
  res.json({ message: 'Task removed' });
});

module.exports = {
  getAllTasks,
  getEmployeeTasks,
  createTask,
  updateTaskStatus,
  deleteTask
}; 