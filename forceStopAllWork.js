const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const forceStopAllWork = async () => {
  try {
    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all incomplete attendance records for today
    const incompleteRecords = await db.collection('attendances').find({
      date: today.toLocaleDateString(),
      status: { $ne: 'Completed' }
    }).toArray();

    if (incompleteRecords.length === 0) {
      console.log('✅ No active work sessions found to stop.');
      process.exit(0);
    }

    console.log(`Found ${incompleteRecords.length} active work session(s) to stop...`);
    
    // Update all incomplete records to mark them as completed
    const result = await db.collection('attendances').updateMany(
      {
        date: today.toLocaleDateString(),
        status: { $ne: 'Completed' }
      },
      {
        $set: {
          endTime: new Date().toLocaleTimeString(),
          endTimestamp: new Date(),
          status: 'Force Completed',
          workSummary: 'Work session force stopped by admin',
          updatedAt: new Date()
        }
      }
    );

    console.log(`✅ Successfully force stopped ${result.modifiedCount} work session(s) at ${new Date().toLocaleTimeString()}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error force stopping work sessions:', error);
    process.exit(1);
  }
};

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

db.once('open', async () => {
  console.log('Connected to MongoDB');
  await forceStopAllWork();
});
