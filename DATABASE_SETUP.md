# 🗄️ MongoDB Database - Setup & Connection Guide

## ✅ Current Status

**MongoDB Connection: ACTIVE** 🟢

```
Database: hr_management
Version: 8.0.9
Port: 27017
Status: Running
```

---

## 📊 Database Overview

### Collections:

| Collection   | Documents | Description                    |
|--------------|-----------|--------------------------------|
| employees    | 3         | User accounts & profiles       |
| messages     | 1         | Chat messages between users    |
| attendances  | 1         | Clock in/out records           |
| leaves       | 2         | Leave requests & approvals     |
| settings     | 1         | System settings & branding     |

---

## 🔌 Connection Details

### Connection String:
```
mongodb://localhost:27017/hr_management
```

### Backend Configuration:
```javascript
// Located in: backend/server.js
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/hr_management',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
```

---

## 🧪 Test Database Connection

### Quick Test:
```bash
cd backend
npm run test-db
```

### Manual Test:
```bash
node backend/scripts/testConnection.js
```

### Expected Output:
```
✅ MongoDB Connection SUCCESSFUL!

📊 Database Information:
   MongoDB Version: 8.0.9
   Database Name: hr_management
   Collections: 5
      - employees
      - messages
      - attendances
      - leaves
      - settings
```

---

## 🛠️ MongoDB Service Management

### Check Status:
```powershell
Get-Service -Name MongoDB
```

### Start Service:
```powershell
net start MongoDB
```

### Stop Service:
```powershell
net stop MongoDB
```

### Restart Service:
```powershell
net stop MongoDB
net start MongoDB
```

---

## 📦 Database Operations

### Seed Database with Default Users:
```bash
cd backend
npm run seed
```
Creates 6 default users with password: `password123`

### View All Credentials:
```bash
cd backend
npm run show-credentials
```

### Clear and Re-seed:
```bash
node backend/scripts/clearAndSeed.js
```

---

## 🗂️ Data Models

### 1. Employee Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/hr/employee),
  department: String,
  color: String,
  profilePic: String,
  dateOfBirth: String,
  mustChangePassword: Boolean,
  hrClockedIn: Boolean
}
```

### 2. Message Schema
```javascript
{
  senderId: ObjectId,
  senderName: String,
  receiverId: ObjectId,
  message: String,
  timestamp: String,
  read: Boolean,
  delivered: Boolean,
  readAt: Date
}
```

### 3. Attendance Schema
```javascript
{
  employeeId: ObjectId,
  employeeName: String,
  date: String,
  startTime: String,
  endTime: String,
  totalHours: String,
  status: String,
  workSummary: String
}
```

### 4. Leave Schema
```javascript
{
  employeeId: ObjectId,
  employeeName: String,
  type: String (sick/casual/annual),
  startDate: String,
  endDate: String,
  reason: String,
  status: String (pending/approved/rejected),
  totalDays: Number
}
```

### 5. Settings Schema
```javascript
{
  companyLogo: String (base64),
  companyName: String,
  theme: String,
  emailTemplates: Object,
  customFields: Array,
  notifications: Object
}
```

---

## 🔧 Troubleshooting

### Problem: "MongoDB service not found"
**Solution:**
1. Check if MongoDB is installed
2. Install MongoDB Community Edition from mongodb.com
3. Ensure MongoDB is added to Windows Services

### Problem: "Connection refused"
**Solution:**
```powershell
# Start MongoDB service
net start MongoDB

# Check if port 27017 is listening
netstat -ano | findstr :27017
```

### Problem: "Authentication failed"
**Solution:**
- The default setup doesn't require authentication
- If you enabled auth, update connection string:
  ```
  mongodb://username:password@localhost:27017/hr_management
  ```

### Problem: "Database empty after seeding"
**Solution:**
```bash
# Check database name matches
node backend/scripts/testConnection.js

# Re-run seed with correct database
cd backend
npm run seed
```

---

## 📈 Database Backup

### Export Database:
```bash
mongodump --db hr_management --out ./backup
```

### Import Database:
```bash
mongorestore --db hr_management ./backup/hr_management
```

### Export Collection to JSON:
```bash
mongoexport --db hr_management --collection employees --out employees.json
```

---

## 🔐 Security Best Practices

1. **Enable Authentication** (Production)
   ```javascript
   mongodb://username:password@localhost:27017/hr_management?authSource=admin
   ```

2. **Use Environment Variables**
   ```
   MONGODB_URI=mongodb://...
   ```

3. **Limit Network Access**
   - Bind to localhost in development
   - Use VPN/firewall in production

4. **Regular Backups**
   - Schedule daily backups
   - Store in secure location

5. **Monitor Connections**
   - Check active connections regularly
   - Close unused connections

---

## 📊 Database Stats

### View Database Size:
```javascript
// In MongoDB shell
use hr_management
db.stats()
```

### Collection Stats:
```javascript
db.employees.stats()
```

### Recent Activity:
```javascript
db.employees.find().sort({createdAt: -1}).limit(5)
```

---

## 🚀 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run test-db` | Test database connection |
| `npm run seed` | Seed with default users |
| `npm run show-credentials` | View all user accounts |
| `Get-Service MongoDB` | Check MongoDB status |
| `net start MongoDB` | Start MongoDB service |

---

## ✅ Connection Checklist

- [x] MongoDB installed (v8.0.9)
- [x] MongoDB service running
- [x] Database created (hr_management)
- [x] Collections created (5 total)
- [x] Users seeded (3 users)
- [x] Backend connected successfully
- [x] Test script working

---

## 📞 Need Help?

### Common Issues:

**"Can't connect to MongoDB"**
```bash
# Check service status
Get-Service MongoDB

# If stopped, start it
net start MongoDB

# Test connection
cd backend
npm run test-db
```

**"No data in database"**
```bash
# Seed database
cd backend
npm run seed

# Verify data
npm run show-credentials
```

**"Wrong database"**
- Check `backend/server.js` line 41
- Should be: `mongodb://localhost:27017/hr_management`
- NOT: `mongodb://localhost:27017/hr-management` (dash vs underscore)

---

## 🎉 You're All Set!

Your MongoDB database is **connected and running**! 🚀

**Current Setup:**
- ✅ Database: hr_management
- ✅ Collections: 5
- ✅ Users: 3 accounts
- ✅ Service: Running
- ✅ Backend: Connected

**Next Steps:**
1. Login at http://localhost:3001
2. Use credentials from `npm run show-credentials`
3. Start using the HR Management System!

---

**Last Updated:** November 4, 2025  
**Database Version:** MongoDB 8.0.9  
**Status:** 🟢 Active & Connected
