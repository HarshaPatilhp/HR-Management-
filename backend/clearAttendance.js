const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Get count before deletion
    const countBefore = await Attendance.countDocuments();
    
    if (countBefore === 0) {
      console.log('No attendance records found to delete.');
      process.exit(0);
    }
    
    console.log(`Found ${countBefore} attendance records to delete.`);
    
    // Delete all attendance records
    const result = await Attendance.deleteMany({});
    
    console.log(`\n✅ Successfully deleted ${result.deletedCount} attendance records.`);
    
    // Verify deletion
    const countAfter = await Attendance.countDocuments();
    console.log(`Total records after deletion: ${countAfter}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing attendance records:', error);
    process.exit(1);
  }
});
