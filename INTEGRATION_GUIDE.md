# 🔗 Backend Integration Guide

## 📋 Overview

This guide will help you integrate the backend API with your React frontend.

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  mongod
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `backend/.env` with your connection string

### Step 3: Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hr_management
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

### Step 4: Seed Database

```bash
cd backend
npm run seed
```

This creates default users:
- Admin: admin@company.com / admin123
- HR: hr@company.com / hr1234
- Employees: john@company.com / john123, jane@company.com / jane123

### Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:5000`

### Step 6: Install Frontend Dependencies

```bash
cd ..
npm install axios
```

### Step 7: Create .env for Frontend

Create `.env` in root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 8: Update Frontend to Use API

The API service is already created at `src/services/api.js`

## 🔄 Integration Examples

### Example 1: Login with Backend

Replace the login logic in `HRManagementSystem.jsx`:

```javascript
import { authAPI } from '../services/api';

const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError('');
  
  try {
    const data = await authAPI.login(loginEmail, loginPassword);
    setCurrentUser(data.user);
    setLoginEmail('');
    setLoginPassword('');
    showNotification('Welcome!', `Hello ${data.user.name}, you're now logged in.`);
  } catch (error) {
    if (error.response?.data?.error) {
      setLoginError(error.response.data.error);
    } else {
      setLoginError('Login failed. Please try again.');
    }
  }
};
```

### Example 2: Fetch Employees

```javascript
import { employeeAPI } from '../services/api';

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  
  if (currentUser) {
    fetchEmployees();
  }
}, [currentUser]);
```

### Example 3: Submit Leave Request

```javascript
import { leaveAPI } from '../services/api';

const handleLeaveSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const leaveData = {
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      ...leaveForm,
      appliedDate: new Date().toLocaleDateString()
    };
    
    const response = await leaveAPI.submit(leaveData);
    showNotification('Success', 'Leave request submitted successfully');
    
    // Refresh leave requests
    const leaves = await leaveAPI.getAll(currentUser.id);
    setLeaveRequests(leaves);
  } catch (error) {
    showNotification('Error', error.response?.data?.error || 'Failed to submit leave');
  }
};
```

## 📁 Project Structure

```
hr-management-system/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── server.js         # Express server
│   ├── seed.js           # Database seeder
│   ├── package.json
│   └── .env
├── src/
│   ├── components/
│   │   └── HRManagementSystem.jsx
│   ├── services/
│   │   └── api.js        # API service layer
│   └── ...
└── package.json
```

## 🔐 Authentication Flow

1. User logs in → Backend validates credentials
2. Backend returns JWT token + user data
3. Token stored in localStorage
4. Token sent with every API request
5. Backend verifies token for protected routes

## 🛠️ Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## 📡 API Endpoints Reference

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register employee

### Employees
- `GET /api/employees` - Get all
- `GET /api/employees/:id` - Get one
- `PUT /api/employees/:id` - Update
- `DELETE /api/employees/:id` - Delete
- `PUT /api/employees/:id/clock-in` - HR clock in

### Attendance
- `GET /api/attendance` - Get records
- `POST /api/attendance/start` - Start work
- `PUT /api/attendance/:id/complete` - Complete work

### Leave
- `GET /api/leave` - Get requests
- `POST /api/leave` - Submit request
- `PUT /api/leave/:id/approve` - Approve
- `PUT /api/leave/:id/reject` - Reject

### Messages
- `GET /api/messages?userId=:id` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark read

## ⚠️ Important Notes

1. **CORS**: Backend has CORS enabled for frontend communication
2. **Password Security**: Passwords are hashed with bcrypt
3. **JWT Tokens**: Expire in 7 days
4. **Error Handling**: All API calls wrapped in try-catch
5. **Data Persistence**: All data saved to MongoDB

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`

**CORS Error:**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend `.env`

**401 Unauthorized:**
- Token expired, login again
- Check token in localStorage

**Port Already in Use:**
- Change PORT in backend `.env`
- Update REACT_APP_API_URL accordingly

## 🎯 Next Steps

1. Replace all useState mock data with API calls
2. Add loading states for API requests
3. Implement error boundaries
4. Add request caching (React Query)
5. Implement real-time updates (Socket.io)
6. Add file upload for profile pictures
7. Deploy backend (Heroku, Railway, Render)
8. Deploy frontend (Vercel, Netlify)

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Axios Docs](https://axios-http.com/)
