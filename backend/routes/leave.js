const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// @route   GET /api/leave
// @desc    Get all leave requests
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const filter = {};
    if (employeeId) filter.employeeId = employeeId;
    if (status) filter.status = status;

    const leaves = await Leave.find(filter).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Get leave error:', error);
    res.status(500).json({ error: 'Server error fetching leave requests' });
  }
});

// @route   POST /api/leave
// @desc    Submit leave request
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { employeeId, employeeName, type, startDate, endDate, reason, appliedDate } = req.body;

    if (!employeeId || !employeeName || !type || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const newLeave = new Leave({
      employeeId,
      employeeName,
      type,
      startDate,
      endDate,
      reason,
      appliedDate,
      status: 'pending'
    });

    await newLeave.save();
    res.status(201).json({ message: 'Leave request submitted successfully', leave: newLeave });
  } catch (error) {
    console.error('Submit leave error:', error);
    res.status(500).json({ error: 'Server error submitting leave request' });
  }
});

// @route   PUT /api/leave/:id/approve
// @desc    Approve leave request
// @access  Private (HR/Admin only)
router.put('/:id/approve', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    leave.status = 'approved';
    await leave.save();

    res.json({ message: 'Leave request approved', leave });
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ error: 'Server error approving leave' });
  }
});

// @route   PUT /api/leave/:id/reject
// @desc    Reject leave request
// @access  Private (HR/Admin only)
router.put('/:id/reject', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    leave.status = 'rejected';
    await leave.save();

    res.json({ message: 'Leave request rejected', leave });
  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({ error: 'Server error rejecting leave' });
  }
});

module.exports = router;
