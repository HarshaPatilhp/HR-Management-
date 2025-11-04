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
  console.log('Received start work request:', {
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });

  try {
    const { employeeId, employeeName, date, startTime, startTimestamp } = req.body;

    // Validate required fields
    if (!employeeId) {
      console.error('Missing employeeId in request');
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    // Check if already clocked in today
    const existingRecord = await Attendance.findOne({ employeeId, date });
    if (existingRecord) {
      console.log('User already clocked in today:', { employeeId, date });
      return res.status(400).json({ 
        error: 'Already clocked in today',
        existingRecord
      });
    }

    const newAttendance = new Attendance({
      employeeId,
      employeeName: employeeName || `Employee ${employeeId}`,
      date: date || new Date().toLocaleDateString(),
      startTime: startTime || new Date().toLocaleTimeString(),
      startTimestamp: startTimestamp || Date.now(),
      status: 'In Progress',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Saving new attendance record:', newAttendance);
    
    try {
      const savedAttendance = await newAttendance.save();
      console.log('Successfully saved attendance:', savedAttendance);
      
      res.status(201).json({ 
        message: 'Work started successfully', 
        attendance: savedAttendance 
      });
    } catch (saveError) {
      console.error('Error saving attendance:', {
        error: saveError,
        stack: saveError.stack,
        record: newAttendance
      });
      throw saveError;
    }
  } catch (error) {
    console.error('Start work error:', error);
    res.status(500).json({ error: 'Server error starting work' });
  }
});

// @route   PUT /api/attendance/:id/complete
// @desc    Complete work (clock out) or force stop work
// @access  Private
router.put('/:id/complete', async (req, res) => {
  try {
    const { endTime, totalHours, workSummary, tasksCompleted, forceStopped } = req.body;

    // Only require workSummary if not force stopping
    if ((!workSummary || workSummary.trim().length === 0) && !forceStopped) {
      return res.status(400).json({ error: 'Work summary is required' });
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    attendance.endTime = endTime || new Date().toLocaleTimeString();
    attendance.totalHours = totalHours || '0h 0m 0s';
    attendance.workSummary = workSummary || 'Session force stopped by admin';
    attendance.tasksCompleted = tasksCompleted || workSummary || 'Session force stopped by admin';
    attendance.status = forceStopped ? 'Force Stopped' : 'Completed';
    attendance.updatedAt = new Date();

    await attendance.save();

    // Log work completion with summary
    console.log(`✅ ${forceStopped ? 'WORK FORCE STOPPED' : 'WORK COMPLETED'}:`);
    console.log(`   👤 Employee: ${attendance.employeeName}`);
    console.log(`   📅 Date: ${attendance.date}`);
    console.log(`   ⏱️  Total Hours: ${attendance.totalHours}`);
    console.log(`   📝 Work Summary: ${attendance.workSummary}`);
    console.log(`   🏷️  Status: ${attendance.status}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    res.json({ 
      message: forceStopped ? 'Work force stopped successfully' : 'Work completed successfully', 
      attendance 
    });
  } catch (error) {
    console.error('Complete work error:', error);
    res.status(500).json({ error: 'Server error completing work' });
  }
});

// @route   DELETE /api/attendance/history
// @desc    Delete all attendance history (Admin only)
// @access  Private (Admin)
// NOTE: This route must come BEFORE /:id to avoid "history" being treated as an ID
router.delete('/history', async (req, res) => {
  try {
    const result = await Attendance.deleteMany({});
    
    console.log('🗑️  ATTENDANCE HISTORY DELETED:');
    console.log(`   📊 Records Deleted: ${result.deletedCount}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    res.json({ 
      message: 'All attendance history deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Delete attendance history error:', error);
    res.status(500).json({ error: 'Server error deleting attendance history' });
  }
});

// @route   DELETE /api/attendance/:id
// @desc    Delete a single attendance record (Admin only)
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    await Attendance.findByIdAndDelete(req.params.id);
    
    console.log('🗑️  ATTENDANCE RECORD DELETED:');
    console.log(`   👤 Employee: ${attendance.employeeName}`);
    console.log(`   📅 Date: ${attendance.date}`);
    console.log(`   ⏰ Time: ${new Date().toLocaleString()}`);
    console.log('─────────────────────────────────────────');

    res.json({ 
      message: 'Attendance record deleted successfully', 
      attendance 
    });
  } catch (error) {
    console.error('Delete attendance record error:', error);
    res.status(500).json({ error: 'Server error deleting attendance record' });
  }
});

module.exports = router;
