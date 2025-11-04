const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Company Branding
  companyLogo: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    default: 'HR Portal'
  },
  
  // Theme Settings
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  primaryColor: {
    type: String,
    default: '#3B82F6'
  },
  
  // Email Templates
  emailTemplates: {
    welcomeEmail: {
      subject: { type: String, default: 'Welcome to {{companyName}}!' },
      body: { type: String, default: '' }
    },
    leaveRequest: {
      subject: { type: String, default: 'Leave Request from {{employeeName}}' },
      body: { type: String, default: '' }
    },
    leaveApproval: {
      subject: { type: String, default: 'Your Leave Request has been Approved' },
      body: { type: String, default: '' }
    },
    leaveRejection: {
      subject: { type: String, default: 'Your Leave Request has been Rejected' },
      body: { type: String, default: '' }
    },
    passwordReset: {
      subject: { type: String, default: 'Password Reset Request' },
      body: { type: String, default: '' }
    },
    salarySlip: {
      subject: { type: String, default: 'Your Salary Slip for {{month}}' },
      body: { type: String, default: '' }
    },
    performanceReview: {
      subject: { type: String, default: 'Performance Review Reminder' },
      body: { type: String, default: '' }
    },
    exitAcceptance: {
      subject: { type: String, default: 'Resignation Acceptance' },
      body: { type: String, default: '' }
    }
  },
  
  // Employee Data Templates
  customFields: [{
    fieldName: String,
    fieldType: { type: String, enum: ['text', 'number', 'date', 'select', 'textarea'] },
    options: [String],
    required: { type: Boolean, default: false }
  }],
  
  onboardingChecklist: [{
    task: String,
    completed: { type: Boolean, default: false }
  }],
  
  documentTypes: [{
    name: String,
    required: { type: Boolean, default: false }
  }],
  
  // Notification Settings
  notifications: {
    emailEnabled: { type: Boolean, default: false },
    smsEnabled: { type: Boolean, default: false },
    triggers: {
      leaveApproved: { type: Boolean, default: true },
      leaveRejected: { type: Boolean, default: true },
      attendanceMissing: { type: Boolean, default: true },
      probationEnd: { type: Boolean, default: true },
      birthdayReminder: { type: Boolean, default: true }
    }
  },
  
  // System Settings
  isDefault: {
    type: Boolean,
    default: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
