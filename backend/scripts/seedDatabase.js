const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing employees
    await Employee.deleteMany({});
    console.log('🗑️  Cleared existing employees\n');
    
    // Default password for all users
    const defaultPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);
    
    // Default employees
    const employees = [
      {
        name: 'Harsha Patil',
        email: 'harsha@company.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Administration',
        color: 'bg-purple-500',
        profilePic: '👨‍💼',
        mustChangePassword: true  // Force password change on first login
      },
      {
        name: 'Priya Sharma',
        email: 'priya@company.com',
        password: hashedPassword,
        role: 'hr',
        department: 'Human Resources',
        color: 'bg-green-500',
        profilePic: '👩‍💼',
        mustChangePassword: true
      },
      {
        name: 'Rahul Kumar',
        email: 'rahul@company.com',
        password: hashedPassword,
        role: 'employee',
        department: 'Engineering',
        color: 'bg-blue-500',
        profilePic: '👨‍💻',
        mustChangePassword: true
      },
      {
        name: 'Anita Desai',
        email: 'anita@company.com',
        password: hashedPassword,
        role: 'employee',
        department: 'Marketing',
        color: 'bg-pink-500',
        profilePic: '👩‍💻',
        mustChangePassword: true
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@company.com',
        password: hashedPassword,
        role: 'employee',
        department: 'Sales',
        color: 'bg-orange-500',
        profilePic: '👨‍💼',
        mustChangePassword: true
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@company.com',
        password: hashedPassword,
        role: 'employee',
        department: 'Finance',
        color: 'bg-indigo-500',
        profilePic: '👩‍💼',
        mustChangePassword: true
      }
    ];
    
    // Insert employees
    const createdEmployees = await Employee.insertMany(employees);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('              ✅ DATABASE SEEDED SUCCESSFULLY!                  ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`📊 Created ${createdEmployees.length} employees\n`);
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    🔐 LOGIN CREDENTIALS                        ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    createdEmployees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.role.toUpperCase().padEnd(10)} - ${emp.name}`);
      console.log(`   📧 Email:    ${emp.email}`);
      console.log(`   🔑 Password: ${defaultPassword}`);
      console.log(`   🏢 Dept:     ${emp.department}\n`);
    });
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                         💡 QUICK START                         ');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('1. Login as Admin:');
    console.log('   Email:    harsha@company.com');
    console.log('   Password: password123\n');
    console.log('2. Login as HR:');
    console.log('   Email:    priya@company.com');
    console.log('   Password: password123\n');
    console.log('3. Login as Employee:');
    console.log('   Email:    rahul@company.com');
    console.log('   Password: password123\n');
    
    mongoose.connection.close();
    console.log('✅ Database connection closed.\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
