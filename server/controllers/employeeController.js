const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new employee
// @route   POST /api/employees/register
// @access  Public
const registerEmployee = async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { name, email, gender, domain, password, role } = req.body;

    // Check if employee exists
    let employee = await Employee.findOne({ email });
    if (employee) {
      console.log('Employee already exists:', email);
      return res.status(400).json({ message: 'Employee already exists' });
    }

    // Create new employee
    employee = new Employee({
      name,
      email,
      gender,
      domain,
      password,
      role: role || 'employee'
    });

    console.log('Saving new employee to database...');
    await employee.save();
    console.log('Employee saved successfully:', employee);

    // Create token
    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login employee
// @route   POST /api/employees/login
// @access  Public
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    // Find employee by email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      console.log('Employee not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: employee._id,
        email: employee.email,
        role: employee.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('Login successful for:', email);
    res.json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get employee profile
// @route   GET /api/employees/profile
// @access  Private
const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id);

    if (employee) {
      res.json({
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        gender: employee.gender,
        domain: employee.domain,
        role: employee.role,
      });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update employee profile
// @route   PUT /api/employees/profile
// @access  Private
const updateEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id);

    if (employee) {
      employee.name = req.body.name || employee.name;
      employee.email = req.body.email || employee.email;
      employee.gender = req.body.gender || employee.gender;
      employee.domain = req.body.domain || employee.domain;

      if (req.body.password) {
        employee.password = req.body.password;
      }

      const updatedEmployee = await employee.save();

      res.json({
        _id: updatedEmployee._id,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        gender: updatedEmployee.gender,
        domain: updatedEmployee.domain,
        role: updatedEmployee.role,
        token: generateToken(updatedEmployee._id),
      });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).select('-password');
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      await employee.deleteOne();
      res.json({ message: 'Employee removed' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
      employee.name = req.body.name || employee.name;
      employee.email = req.body.email || employee.email;
      employee.gender = req.body.gender || employee.gender;
      employee.domain = req.body.domain || employee.domain;
      employee.role = req.body.role || employee.role;

      const updatedEmployee = await employee.save();

      res.json({
        _id: updatedEmployee._id,
        name: updatedEmployee.name,
        email: updatedEmployee.email,
        gender: updatedEmployee.gender,
        domain: updatedEmployee.domain,
        role: updatedEmployee.role,
      });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerEmployee,
  loginEmployee,
  getEmployeeProfile,
  updateEmployeeProfile,
  getEmployees,
  deleteEmployee,
  getEmployeeById,
  updateEmployee,
};