# HR Management System - Backend API

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation Steps

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file with your MongoDB connection string
   - Change JWT_SECRET to a secure random string

4. **Start MongoDB**
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - Or use MongoDB Atlas cloud database

5. **Seed the database** (Optional - creates default users)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new employee

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `PUT /api/employees/:id/clock-in` - HR clock in

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/start` - Start work (clock in)
- `PUT /api/attendance/:id/complete` - Complete work (clock out)

### Leave
- `GET /api/leave` - Get leave requests
- `POST /api/leave` - Submit leave request
- `PUT /api/leave/:id/approve` - Approve leave
- `PUT /api/leave/:id/reject` - Reject leave

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

## 🔐 Default Login Credentials

After running `npm run seed`:

- **Admin**: admin@company.com / admin123
- **HR**: hr@company.com / hr1234
- **Employee**: john@company.com / john123
- **Employee**: jane@company.com / jane123

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
