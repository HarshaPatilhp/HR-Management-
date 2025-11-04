const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Get the current date in the same format as stored
    const today = new Date();
    const todayString = today.toLocaleDateString();
    
    console.log(`\nChecking attendance records for today (${todayString}):`);
    
    // Get all attendance records for today
    const Attendance = require('./models/Attendance');
    const records = await Attendance.find({ date: todayString });
    
    if (records.length === 0) {
      console.log('No attendance records found for today.');
    } else {
      console.log(`Found ${records.length} attendance record(s) for today:`);
      console.log('----------------------------------------');
      records.forEach((record, index) => {
        console.log(`Record ${index + 1}:`);
        console.log(`  Employee ID: ${record.employeeId}`);
        console.log(`  Employee Name: ${record.employeeName}`);
        console.log(`  Start Time: ${record.startTime}`);
        console.log(`  End Time: ${record.endTime || 'Not ended'}`);
        console.log(`  Status: ${record.status}`);
        console.log(`  Work Summary: ${record.workSummary || 'N/A'}`);
        console.log(`  Created At: ${record.createdAt}`);
        console.log('----------------------------------------');
      });
    }
    
    // Also check for any 'In Progress' records that might be stuck
    const inProgress = await Attendance.find({ status: 'In Progress' });
    if (inProgress.length > 0) {
      console.log('\nFound potentially stuck "In Progress" records:');
      console.log('----------------------------------------');
      inProgress.forEach((record, index) => {
        console.log(`Record ${index + 1}:`);
        console.log(`  Employee ID: ${record.employeeId}`);
        console.log(`  Employee Name: ${record.employeeName}`);
        console.log(`  Date: ${record.date}`);
        console.log(`  Start Time: ${record.startTime}`);
        console.log(`  Created At: ${record.createdAt}`);
        console.log('----------------------------------------');
      });
    } else {
      console.log('\nNo "In Progress" records found.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking attendance:', error);
    process.exit(1);
  }
});
