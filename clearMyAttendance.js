const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const clearTodaysAttendance = async () => {
  try {
    await db.collection('attendances').deleteMany({
      date: new Date().toLocaleDateString(),
      employeeId: 'YOUR_EMPLOYEE_ID' // Replace with your actual employee ID
    });
    
    console.log('✅ Your attendance for today has been cleared.');
    console.log('You can now start work again.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing attendance:', error);
    process.exit(1);
  }
};

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');
  await clearTodaysAttendance();
});
