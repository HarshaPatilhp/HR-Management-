const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');
const Message = require('./models/Message');
require('dotenv').config();

const viewDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // View Employees
    console.log('👥 ═══════════════════════════════════════');
    console.log('   EMPLOYEES');
    console.log('═══════════════════════════════════════\n');
    const employees = await Employee.find().select('-password');
    if (employees.length === 0) {
      console.log('   No employees found.\n');
    } else {
      employees.forEach((emp, index) => {
        console.log(`${index + 1}. ${emp.name}`);
        console.log(`   📧 Email: ${emp.email}`);
        console.log(`   👤 Role: ${emp.role}`);
        console.log(`   🏢 Department: ${emp.department}`);
        console.log(`   🆔 ID: ${emp._id}`);
        console.log(`   📅 Created: ${emp.createdAt?.toLocaleString() || 'N/A'}`);
        console.log('');
      });
      console.log(`   Total Employees: ${employees.length}\n`);
    }

    // View Attendance Records
    console.log('⏰ ═══════════════════════════════════════');
    console.log('   ATTENDANCE RECORDS');
    console.log('═══════════════════════════════════════\n');
    const attendance = await Attendance.find().sort({ createdAt: -1 }).limit(10);
    if (attendance.length === 0) {
      console.log('   No attendance records found.\n');
    } else {
      attendance.forEach((record, index) => {
        console.log(`${index + 1}. ${record.employeeName}`);
        console.log(`   📅 Date: ${record.date}`);
        console.log(`   🕐 Start: ${record.startTime}`);
        console.log(`   🕐 End: ${record.endTime || 'In Progress'}`);
        console.log(`   ⏱️  Total: ${record.totalHours || 'N/A'}`);
        console.log(`   📊 Status: ${record.status}`);
        console.log('');
      });
      console.log(`   Total Records: ${attendance.length} (showing last 10)\n`);
    }

    // View Leave Requests
    console.log('📅 ═══════════════════════════════════════');
    console.log('   LEAVE REQUESTS');
    console.log('═══════════════════════════════════════\n');
    const leaves = await Leave.find().sort({ createdAt: -1 }).limit(10);
    if (leaves.length === 0) {
      console.log('   No leave requests found.\n');
    } else {
      leaves.forEach((leave, index) => {
        console.log(`${index + 1}. ${leave.employeeName}`);
        console.log(`   📝 Type: ${leave.type}`);
        console.log(`   📅 From: ${leave.startDate} to ${leave.endDate}`);
        console.log(`   💬 Reason: ${leave.reason}`);
        console.log(`   📊 Status: ${leave.status}`);
        console.log(`   📅 Applied: ${leave.appliedDate}`);
        console.log('');
      });
      console.log(`   Total Leaves: ${leaves.length} (showing last 10)\n`);
    }

    // View Messages
    console.log('💬 ═══════════════════════════════════════');
    console.log('   MESSAGES');
    console.log('═══════════════════════════════════════\n');
    const messages = await Message.find().sort({ createdAt: -1 }).limit(10);
    if (messages.length === 0) {
      console.log('   No messages found.\n');
    } else {
      messages.forEach((msg, index) => {
        console.log(`${index + 1}. From: ${msg.senderName}`);
        console.log(`   💬 Message: ${msg.message}`);
        console.log(`   📅 Time: ${msg.timestamp}`);
        console.log(`   👁️  Read: ${msg.read ? 'Yes' : 'No'}`);
        console.log('');
      });
      console.log(`   Total Messages: ${messages.length} (showing last 10)\n`);
    }

    // Summary
    const totalEmployees = await Employee.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalLeaves = await Leave.countDocuments();
    const totalMessages = await Message.countDocuments();

    console.log('📊 ═══════════════════════════════════════');
    console.log('   DATABASE SUMMARY');
    console.log('═══════════════════════════════════════\n');
    console.log(`   👥 Total Employees: ${totalEmployees}`);
    console.log(`   ⏰ Total Attendance Records: ${totalAttendance}`);
    console.log(`   📅 Total Leave Requests: ${totalLeaves}`);
    console.log(`   💬 Total Messages: ${totalMessages}`);
    console.log('\n═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

viewDatabase();
