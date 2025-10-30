const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['employee', 'hr', 'admin'],
    default: 'employee'
  },
  department: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'bg-blue-500'
  },
  profilePic: {
    type: String,
    default: '👨‍💼'
  },
  hrClockedIn: {
    type: Boolean,
    default: false
  },
  mustChangePassword: {
    type: Boolean,
    default: true
  },
  dateOfBirth: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
