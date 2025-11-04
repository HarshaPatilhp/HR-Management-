const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');
require('dotenv').config();

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

const clearAndSeed = async () => {
  try {
    await connectDB();
    
    // Delete all employees
    const deleteResult = await Employee.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing employees\n`);
    
    // Default password
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    
    console.log('Creating new employees...\n');
    
    // Create employees one by one
    const employeeData = [
      { name: 'Harsha Patil', email: 'harsha@company.com', role: 'admin', department: 'Administration', color: 'bg-purple-500', profilePic: '👨‍💼' },
      { name: 'Priya Sharma', email: 'priya@company.com', role: 'hr', department: 'Human Resources', color: 'bg-green-500', profilePic: '👩‍💼' },
      { name: 'Rahul Kumar', email: 'rahul@company.com', role: 'employee', department: 'Engineering', color: 'bg-blue-500', profilePic: '👨‍💻' },
      { name: 'Anita Desai', email: 'anita@company.com', role: 'employee', department: 'Marketing', color: 'bg-pink-500', profilePic: '👩‍💻' },
      { name: 'Vikram Singh', email: 'vikram@company.com', role: 'employee', department: 'Sales', color: 'bg-orange-500', profilePic: '👨‍💼' },
      { name: 'Sneha Reddy', email: 'sneha@company.com', role: 'employee', department: 'Finance', color: 'bg-indigo-500', profilePic: '👩‍💼' }
    ];
    
    const createdEmployees = [];
    
    for (const emp of employeeData) {
      try {
        const newEmployee = new Employee({
          ...emp,
          password: hashedPassword,
          mustChangePassword: true  // Force password change on first login
        });
        const saved = await newEmployee.save();
        createdEmployees.push(saved);
        console.log(`✅ Created: ${emp.name} (${emp.email})`);
      } catch (error) {
        console.error(`❌ Failed to create ${emp.name}:`, error.message);
      }
    }
    
    console.log(`\n═══════════════════════════════════════════════════════════════`);
    console.log(`              ✅ CREATED ${createdEmployees.length} EMPLOYEES                   `);
    console.log(`═══════════════════════════════════════════════════════════════\n`);
    
    console.log('🔐 ALL ACCOUNTS - Password: password123\n');
    createdEmployees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.role.toUpperCase().padEnd(10)} - ${emp.name}`);
      console.log(`   📧 ${emp.email}\n`);
    });
    
    mongoose.connection.close();
    console.log('✅ Database connection closed.\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

clearAndSeed();
