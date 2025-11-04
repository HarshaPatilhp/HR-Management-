const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const listAllAttendance = async () => {
  try {
    // Get all attendance records, sorted by date (newest first)
    const records = await db.collection('attendances')
      .find({})
      .sort({ date: -1, startTime: -1 })
      .limit(10) // Show only the 10 most recent records
      .toArray();

    if (records.length === 0) {
      console.log('No attendance records found in the database.');
    } else {
      console.log(`\n📋 Found ${records.length} most recent attendance records:\n`);
      
      records.forEach((record, index) => {
        console.log(`--- Record ${index + 1} ---`);
        console.log(`ID: ${record._id}`);
        console.log(`Employee: ${record.employeeName || 'N/A'} (${record.employeeId || 'N/A'})`);
        console.log(`Date: ${record.date || 'N/A'}`);
        console.log(`Status: ${record.status || 'N/A'}`);
        console.log(`Start Time: ${record.startTime || 'N/A'}`);
        console.log(`End Time: ${record.endTime || 'Still working'}`);
        console.log(`Created: ${new Date(record.createdAt).toLocaleString() || 'N/A'}`);
        console.log(`Updated: ${new Date(record.updatedAt).toLocaleString() || 'N/A'}`);
        console.log('');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing attendance records:', error);
    process.exit(1);
  }
};

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');
  await listAllAttendance();
});
