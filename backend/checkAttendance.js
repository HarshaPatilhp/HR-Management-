const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const checkTodaysAttendance = async () => {
  try {
    const today = new Date().toLocaleDateString();
    console.log(`\n📅 Checking attendance for: ${today}\n`);
    
    // Get all attendance records for today
    const records = await db.collection('attendances')
      .find({ date: today })
      .sort({ startTime: -1 })
      .toArray();

    if (records.length === 0) {
      console.log('No attendance records found for today.');
    } else {
      console.log(`Found ${records.length} attendance record(s) for today:\n`);
      records.forEach((record, index) => {
        console.log(`--- Record ${index + 1} ---`);
        console.log(`Employee: ${record.employeeName || 'N/A'} (${record.employeeId})`);
        console.log(`Status: ${record.status || 'N/A'}`);
        console.log(`Start Time: ${record.startTime || 'N/A'}`);
        console.log(`End Time: ${record.endTime || 'Still working'}`);
        console.log(`Work Summary: ${record.workSummary || 'Not provided'}\n`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking attendance:', error);
    process.exit(1);
  }
};

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');
  await checkTodaysAttendance();
});
