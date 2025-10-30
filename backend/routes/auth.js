const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await Employee.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Log successful login
    console.log('🔐 USER LOGIN:');
    console.log(`   📝 Name: ${user.name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Role: ${user.role}`);
    console.log(`   🏢 Department: ${user.department}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      color: user.color,
      profilePic: user.profilePic,
      mustChangePassword: user.mustChangePassword,
      dateOfBirth: user.dateOfBirth
    };

    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   POST /api/auth/register
// @desc    Register new employee (Admin only)
// @access  Private
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, color, profilePic } = req.body;

    // Validate input
    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: 'Please fill all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existingUser = await Employee.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new employee
    const newEmployee = new Employee({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'employee',
      department,
      color: color || 'bg-blue-500',
      profilePic: profilePic || '👨‍💼'
    });

    await newEmployee.save();

    // Log employee creation
    console.log('✅ EMPLOYEE ADDED:');
    console.log(`   📝 Name: ${newEmployee.name}`);
    console.log(`   📧 Email: ${newEmployee.email}`);
    console.log(`   👤 Role: ${newEmployee.role}`);
    console.log(`   🏢 Department: ${newEmployee.department}`);
    console.log(`   🆔 ID: ${newEmployee._id}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    // Return employee data (excluding password)
    const employeeData = {
      id: newEmployee._id,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      color: newEmployee.color,
      profilePic: newEmployee.profilePic
    };

    res.status(201).json({ message: 'Employee created successfully', employee: employeeData });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password (force reset)
// @access  Private
router.post('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await Employee.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.mustChangePassword = false;

    await user.save();

    console.log('🔑 PASSWORD CHANGED:');
    console.log(`   📝 Name: ${user.name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    res.json({ message: 'Password changed successfully', mustChangePassword: false });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error changing password' });
  }
});

// @route   POST /api/auth/update-dob
// @desc    Update date of birth
// @access  Private
router.post('/update-dob', async (req, res) => {
  try {
    const { userId, dateOfBirth } = req.body;

    if (!userId || !dateOfBirth) {
      return res.status(400).json({ error: 'Please provide user ID and date of birth' });
    }

    const user = await Employee.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.dateOfBirth = dateOfBirth;
    await user.save();

    console.log('🎂 DATE OF BIRTH UPDATED:');
    console.log(`   📝 Name: ${user.name}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   🎂 DOB: ${dateOfBirth}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    res.json({ message: 'Date of birth updated successfully', dateOfBirth });
  } catch (error) {
    console.error('Update DOB error:', error);
    res.status(500).json({ error: 'Server error updating date of birth' });
  }
});

module.exports = router;
