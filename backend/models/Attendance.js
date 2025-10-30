const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  startTimestamp: {
    type: Number,
    required: true
  },
  endTime: {
    type: String,
    default: null
  },
  totalHours: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed'],
    default: 'In Progress'
  },
  workSummary: {
    type: String,
    default: null
  },
  tasksCompleted: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
