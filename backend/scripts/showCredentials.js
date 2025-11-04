const mongoose = require('mongoose');
const Employee = require('../models/Employee');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const showAllCredentials = async () => {
  try {
    await connectDB();
    
    const employees = await Employee.find({}).select('name email role department dateOfBirth profilePic mustChangePassword createdAt');
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    📋 ALL USER CREDENTIALS                     ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    if (employees.length === 0) {
      console.log('⚠️  No employees found in the database.\n');
      console.log('💡 Run the seed script to create default users:');
      console.log('   npm run seed\n');
    } else {
      console.log(`Total Users: ${employees.length}\n`);
      
      employees.forEach((emp, index) => {
        console.log(`${index + 1}. ┌─────────────────────────────────────────────────────────┐`);
        console.log(`   │ 👤 Name:           ${emp.name.padEnd(35)} │`);
        console.log(`   │ 📧 Email:          ${emp.email.padEnd(35)} │`);
        console.log(`   │ 🔑 Password:       (hashed - use login to verify)      │`);
        console.log(`   │ 👔 Role:           ${emp.role.toUpperCase().padEnd(35)} │`);
        console.log(`   │ 🏢 Department:     ${emp.department.padEnd(35)} │`);
        console.log(`   │ 🎂 Date of Birth:  ${(emp.dateOfBirth || 'Not Set').padEnd(35)} │`);
        console.log(`   │ 🔄 Must Change PW: ${(emp.mustChangePassword ? 'Yes' : 'No').padEnd(35)} │`);
        console.log(`   │ 📅 Created:        ${new Date(emp.createdAt).toLocaleString().padEnd(35)} │`);
        console.log(`   └─────────────────────────────────────────────────────────┘\n`);
      });
      
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('                     🔐 DEFAULT PASSWORDS                       ');
      console.log('═══════════════════════════════════════════════════════════════\n');
      console.log('If you used the seed script, default passwords are:');
      console.log('  • Admin & HR users:   password123');
      console.log('  • Employee users:     password123\n');
      console.log('💡 Login using any email above with password: password123\n');
      console.log('Note: Passwords are hashed in the database for security.\n');
    }
    
    mongoose.connection.close();
    console.log('✅ Database connection closed.\n');
  } catch (error) {
    console.error('❌ Error fetching credentials:', error);
    process.exit(1);
  }
};

showAllCredentials();
