const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Employee.deleteMany({});
    console.log('🗑️  Cleared existing employees');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const hrPassword = await bcrypt.hash('hr1234', salt);
    const johnPassword = await bcrypt.hash('john123', salt);
    const janePassword = await bcrypt.hash('jane123', salt);

    // Create default employees
    const employees = [
      {
        name: 'Admin User',
        email: 'admin@company.com',
        password: adminPassword,
        role: 'admin',
        department: 'Management',
        color: 'bg-purple-500',
        profilePic: '👨‍💼'
      },
      {
        name: 'HR Manager',
        email: 'hr@company.com',
        password: hrPassword,
        role: 'hr',
        department: 'Human Resources',
        color: 'bg-green-500',
        profilePic: '👩‍💼'
      },
      {
        name: 'John Doe',
        email: 'john@company.com',
        password: johnPassword,
        role: 'employee',
        department: 'Engineering',
        color: 'bg-blue-500',
        profilePic: '👨‍💻'
      },
      {
        name: 'Jane Smith',
        email: 'jane@company.com',
        password: janePassword,
        role: 'employee',
        department: 'Marketing',
        color: 'bg-pink-500',
        profilePic: '👩‍💻'
      }
    ];

    await Employee.insertMany(employees);
    console.log('✅ Seeded employees successfully');
    console.log('\n📋 Default Login Credentials:');
    console.log('Admin: admin@company.com / admin123');
    console.log('HR: hr@company.com / hr1234');
    console.log('Employee: john@company.com / john123');
    console.log('Employee: jane@company.com / jane123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
