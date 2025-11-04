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

const fixAllPasswords = async () => {
  try {
    await connectDB();
    
    const newPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    🔧 FIXING ALL PASSWORDS                     ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`New password for all users: ${newPassword}\n`);
    console.log(`Generated hash: ${hashedPassword.substring(0, 30)}...\n`);
    
    // Get all employees
    const employees = await Employee.find({});
    
    if (employees.length === 0) {
      console.log('❌ No employees found!\n');
      console.log('💡 Run: npm run seed\n');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found ${employees.length} employees. Updating passwords...\n`);
    
    // Update all passwords
    for (const emp of employees) {
      emp.password = hashedPassword;
      emp.mustChangePassword = false;
      await emp.save();
      console.log(`✅ Updated: ${emp.name} (${emp.email})`);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                     ✅ PASSWORDS FIXED!                        ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('All users can now login with password: password123\n');
    
    // Verify one user
    console.log('🔍 Verifying first user...\n');
    const testUser = employees[0];
    const isMatch = await bcrypt.compare(newPassword, testUser.password);
    
    if (isMatch) {
      console.log('✅ Password verification SUCCESSFUL!\n');
      console.log('You can now login with:');
      console.log(`   Email:    ${testUser.email}`);
      console.log(`   Password: ${newPassword}\n`);
    } else {
      console.log('❌ Password verification FAILED!\n');
    }
    
    mongoose.connection.close();
    console.log('✅ Database connection closed.\n');
  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
    process.exit(1);
  }
};

fixAllPasswords();
