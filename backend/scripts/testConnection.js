const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_management';
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('              🔌 MONGODB CONNECTION TEST                        ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`Attempting to connect to: ${mongoURI}\n`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connection SUCCESSFUL!\n');
    
    // Get database info
    const db = mongoose.connection.db;
    const admin = db.admin();
    const info = await admin.serverInfo();
    
    console.log('📊 Database Information:');
    console.log(`   MongoDB Version: ${info.version}`);
    console.log(`   Database Name: ${db.databaseName}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`   Collections: ${collections.length}`);
    collections.forEach(col => {
      console.log(`      - ${col.name}`);
    });
    
    // Count documents in each collection
    console.log('\n📈 Document Counts:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   ${col.name}: ${count} documents`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                   ✅ CONNECTION STATUS: ACTIVE                 ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    mongoose.connection.close();
    console.log('✅ Connection closed successfully.\n');
  } catch (error) {
    console.log('\n❌ MongoDB Connection FAILED!');
    console.log(`Error: ${error.message}\n`);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                   🔧 TROUBLESHOOTING STEPS                     ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('1. Check if MongoDB service is running:');
    console.log('   Get-Service -Name MongoDB\n');
    console.log('2. Start MongoDB if not running:');
    console.log('   net start MongoDB\n');
    console.log('3. Check MongoDB connection string in .env file\n');
    console.log('4. Verify MongoDB is listening on port 27017\n');
    
    process.exit(1);
  }
};

testConnection();
