const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const resetAttendance = async () => {
  try {
    const today = new Date().toLocaleDateString();
    
    // Delete all attendance records for today
    const result = await db.collection('attendances').deleteMany({
      date: today
    });
    
    console.log(`✅ Deleted ${result.deletedCount} attendance record(s) for today (${today})`);
    console.log('\n🔄 Please refresh your browser and try "Start Work" again.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting attendance:', error);
    process.exit(1);
  }
};

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');
  await resetAttendance();
});
