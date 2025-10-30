const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// @route   GET /api/attendance
// @desc    Get all attendance records
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { employeeId } = req.query;
    const filter = employeeId ? { employeeId } : {};
    const records = await Attendance.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Server error fetching attendance' });
  }
});

// @route   POST /api/attendance/start
// @desc    Start work (clock in)
// @access  Private
router.post('/start', async (req, res) => {
  try {
    const { employeeId, employeeName, date, startTime, startTimestamp } = req.body;

    // Check if already clocked in today
    const existingRecord = await Attendance.findOne({ employeeId, date });
    if (existingRecord) {
      return res.status(400).json({ error: 'Already clocked in today' });
    }

    const newAttendance = new Attendance({
      employeeId,
      employeeName,
      date,
      startTime,
      startTimestamp,
      status: 'In Progress'
    });

    await newAttendance.save();
    res.status(201).json({ message: 'Work started successfully', attendance: newAttendance });
  } catch (error) {
    console.error('Start work error:', error);
    res.status(500).json({ error: 'Server error starting work' });
  }
});

// @route   PUT /api/attendance/:id/complete
// @desc    Complete work (clock out)
// @access  Private
router.put('/:id/complete', async (req, res) => {
  try {
    const { endTime, totalHours, workSummary, tasksCompleted } = req.body;

    if (!workSummary || workSummary.trim().length === 0) {
      return res.status(400).json({ error: 'Work summary is required' });
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    attendance.endTime = endTime;
    attendance.totalHours = totalHours;
    attendance.workSummary = workSummary;
    attendance.tasksCompleted = tasksCompleted || workSummary;
    attendance.status = 'Completed';

    await attendance.save();

    // Log work completion with summary
    console.log('✅ WORK COMPLETED:');
    console.log(`   👤 Employee: ${attendance.employeeName}`);
    console.log(`   📅 Date: ${attendance.date}`);
    console.log(`   ⏱️  Total Hours: ${totalHours}`);
    console.log(`   📝 Work Summary: ${workSummary}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    res.json({ message: 'Work completed successfully', attendance });
  } catch (error) {
    console.error('Complete work error:', error);
    res.status(500).json({ error: 'Server error completing work' });
  }
});

module.exports = router;
