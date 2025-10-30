const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Server error fetching employees' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Server error fetching employee' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password, role, department, color, profilePic } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
      if (existingEmployee) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Update fields
    if (name) employee.name = name;
    if (email) employee.email = email.toLowerCase();
    if (role) employee.role = role;
    if (department) employee.department = department;
    if (color) employee.color = color;
    if (profilePic) employee.profilePic = profilePic;

    // Update password if provided
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      employee.password = await bcrypt.hash(password, salt);
    }

    await employee.save();

    // Log employee update
    console.log('✏️  EMPLOYEE UPDATED:');
    console.log(`   📝 Name: ${employee.name}`);
    console.log(`   📧 Email: ${employee.email}`);
    console.log(`   👤 Role: ${employee.role}`);
    console.log(`   🏢 Department: ${employee.department}`);
    console.log(`   🖼️  Profile Pic: ${employee.profilePic}`);
    console.log(`   🆔 ID: ${employee._id}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    const updatedEmployee = {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      color: employee.color,
      profilePic: employee.profilePic
    };

    res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Server error updating employee' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Log employee deletion BEFORE deleting
    console.log('❌ EMPLOYEE DELETED:');
    console.log(`   📝 Name: ${employee.name}`);
    console.log(`   📧 Email: ${employee.email}`);
    console.log(`   👤 Role: ${employee.role}`);
    console.log(`   🏢 Department: ${employee.department}`);
    console.log(`   🆔 ID: ${employee._id}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    await employee.deleteOne();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Server error deleting employee' });
  }
});

// @route   PUT /api/employees/:id/clock-in
// @desc    HR clock in
// @access  Private (HR only)
router.put('/:id/clock-in', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (employee.role !== 'hr') {
      return res.status(403).json({ error: 'Only HR can clock in' });
    }

    employee.hrClockedIn = true;
    await employee.save();

    res.json({ message: 'HR clocked in successfully', hrClockedIn: true });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ error: 'Server error during clock in' });
  }
});

module.exports = router;
