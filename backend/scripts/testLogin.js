const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const testLogin = async () => {
  try {
    await connectDB();
    
    const testEmail = 'harsha@company.com';
    const testPassword = 'password123';
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    🔐 PASSWORD VERIFICATION TEST               ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`Testing login for: ${testEmail}`);
    console.log(`Password: ${testPassword}\n`);
    
    // Find user
    const user = await Employee.findOne({ email: testEmail.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found in database!\n');
      console.log('💡 Run: npm run seed (in backend folder) to create users\n');
      mongoose.connection.close();
      return;
    }
    
    console.log('✅ User found in database:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Stored Password Hash: ${user.password.substring(0, 30)}...\n`);
    
    // Test password
    console.log('🔍 Testing password verification...\n');
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (isMatch) {
      console.log('✅ PASSWORD CORRECT! Login should work.\n');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('                         LOGIN SUCCESSFUL                       ');
      console.log('═══════════════════════════════════════════════════════════════\n');
      console.log('You can now login with:');
      console.log(`   Email:    ${testEmail}`);
      console.log(`   Password: ${testPassword}\n`);
    } else {
      console.log('❌ PASSWORD INCORRECT! There is an issue.\n');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('                         FIXING PASSWORD                        ');
      console.log('═══════════════════════════════════════════════════════════════\n');
      
      // Fix the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      user.password = hashedPassword;
      await user.save();
      
      console.log('✅ Password has been reset!\n');
      console.log('Try logging in again with:');
      console.log(`   Email:    ${testEmail}`);
      console.log(`   Password: ${testPassword}\n`);
    }
    
    mongoose.connection.close();
    console.log('✅ Database connection closed.\n');
  } catch (error) {
    console.error('❌ Error testing login:', error);
    process.exit(1);
  }
};

testLogin();
