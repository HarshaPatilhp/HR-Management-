# 🏢 HR Management System

A comprehensive, full-stack HR Management Portal with modern UI/UX, real-time messaging with WhatsApp-style read receipts, complete employee lifecycle management, and enterprise-grade security features.

[![MongoDB](https://img.shields.io/badge/MongoDB-8.0.9-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Multi-role Access Control** (Admin, HR, Employee)
- **Force Password Change** on first login
- **JWT Token Authentication** with 7-day expiration
- **Account Lockout** after 3 failed login attempts (1-minute cooldown)
- **Password Hashing** with bcrypt (10 salt rounds)
- **Date of Birth Setup** for personalized experience
- **Birthday Notifications** 🎂

### 👥 Employee Management
- **Complete CRUD Operations** (Admin/HR only)
- **Profile Picture Upload** (Preset avatars + custom upload)
- **Department Assignment**
- **Role Management** (Admin/HR/Employee)
- **Employee Directory** with search
- **Profile Updates** with security

### ⏰ Attendance Tracking
- **Clock In/Out** with precise timestamps
- **Work Summary Submission**
- **Real-time Duration Calculation** (hours, minutes, seconds)
- **Attendance History** with date filtering
- **Admin Oversight** - View all employee records
- **Delete Individual Records** (Admin only)
- **Delete All History** (Admin only)
- **Work Summary Details** in modal view

### 📅 Leave Management
- **Leave Request System** (Sick, Casual, Annual)
- **Multi-day Leave** calculation
- **Approval Workflow** (Admin/HR approval)
- **Leave History** with status tracking
- **Reject with Reason** functionality
- **Leave Balance** tracking
- **Filter by Status** (Pending/Approved/Rejected)

### 💬 Advanced Messaging System
- **WhatsApp-Style Read Receipts**
  - Single ✓ (Sent)
  - Double ✓✓ (Delivered)
  - **Bright Cyan ✓✓** (Read) - Optimized for visibility
- **Real-time Updates** (3-second polling)
- **Unread Message Counter**
- **Auto-mark as Read** when viewing
- **Batch Read Operations** for performance
- **One-on-One Chat**
- **Contact Search**
- **Message History**

### ⚙️ System Settings (Admin Only)
- **Company Branding**
  - Upload company logo (Base64 storage)
  - Set company name
  - Logo appears in navbar and login page
- **Professional Email Templates** (8 templates)
  - Welcome Email
  - Leave Notifications
  - Salary Slip
  - Password Reset
  - Performance Review
  - Exit Acceptance
  - Customizable placeholders

### 📊 Dashboard & Analytics
- **Personal Statistics**
- **Quick Actions**
- **Recent Activity Feed**
- **Birthday Reminders**
- **Notifications Center**

### 🔔 Notifications
- **Browser Push Notifications**
- **In-app Notifications**
- **Birthday Wishes**
- **Work Completion Alerts**
- **Clock-in Notifications**

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 14.0.0
MongoDB >= 8.0
npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HarshaPatilhp/HR-Management-.git
cd HR-Management-
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. **Start MongoDB**
```powershell
net start MongoDB
```

4. **Seed database with default users**
```bash
cd backend
npm run seed
```

5. **Start the servers**
```bash
# Backend (from backend folder)
npm run dev

# Frontend (from root folder)
npm start
```

6. **Access the application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:5000

---

## 🔑 Default Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | harsha@company.com | password123 |
| **HR** | priya@company.com | password123 |
| **Employee** | rahul@company.com | password123 |

**Note:** First login requires password change and DOB setup.

---

## 📁 Project Structure

```
hr-management-system/
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── scripts/          # Utility scripts
│   └── server.js         # Express server
├── src/
│   ├── components/       # React components
│   └── services/         # API services
├── public/               # Static assets
└── Documentation/        # Guides and docs
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.x** - UI Library
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens

---

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Step-by-step setup guide
- **[CREDENTIALS.md](./CREDENTIALS.md)** - All user accounts and passwords
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - MongoDB configuration
- **[MESSAGING_FEATURES.md](./MESSAGING_FEATURES.md)** - Messaging system details
- **[READ_RECEIPTS_GUIDE.md](./READ_RECEIPTS_GUIDE.md)** - Read receipts visual guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[STATUS.md](./STATUS.md)** - Current system status

---

## 🔧 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start backend with nodemon
npm run seed         # Seed database with default users
npm run show-credentials  # Display all user credentials
npm run test-db      # Test MongoDB connection
```

### Database Management
```bash
node backend/scripts/clearAndSeed.js    # Reset database
node backend/scripts/testConnection.js  # Test connection
node backend/scripts/showCredentials.js # View all users
```

---

## 🎯 Features Breakdown

### For Admins
✅ Full system control  
✅ Employee management  
✅ Attendance oversight  
✅ Leave approvals  
✅ System settings  
✅ Company branding  
✅ Email template customization  
✅ Delete records  

### For HR
✅ Employee management  
✅ Leave approvals  
✅ Attendance viewing  
✅ Messaging  
✅ Profile updates  

### For Employees
✅ Clock in/out  
✅ Submit work summaries  
✅ Request leave  
✅ View history  
✅ Messaging  
✅ Profile management  

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Force password change
- ✅ Account lockout mechanism
- ✅ Environment variables for secrets
- ✅ Input validation
- ✅ Error handling

---

## 🌟 Highlights

### WhatsApp-Style Messaging
Real-time chat with read receipts optimized for visibility against the purple message background.

### Comprehensive Attendance System
Track every second with precise time calculations and detailed work summaries.

### Professional Email Templates
8 pre-written professional templates ready for HR use with minimal editing.

### Modern UI/UX
Gradient designs, smooth animations, and intuitive navigation.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Harsha Patil**  
GitHub: [@HarshaPatilhp](https://github.com/HarshaPatilhp)

---

## 🙏 Acknowledgments

- MongoDB for the robust database
- React team for the amazing library
- Express.js for the simple yet powerful framework
- Tailwind CSS for beautiful styling
- Lucide Icons for clean iconography

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide
- Review the documentation files

---

## ⭐ Star this repository if you find it helpful!

**Made with ❤️ by Harsha Patil**
