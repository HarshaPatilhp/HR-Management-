const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
require('dotenv').config();

const clearTodayAttendance = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    const today = new Date().toLocaleDateString();
    
    const result = await Attendance.deleteMany({ date: today });
    
    console.log(`🗑️  Deleted ${result.deletedCount} attendance record(s) for today (${today})`);
    console.log('✅ You can now start work again!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

clearTodayAttendance();
