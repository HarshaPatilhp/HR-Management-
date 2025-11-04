# 🔐 HR Management System - Login Credentials

## 📋 All Users in MongoDB Database

### 1. **ADMIN** - Harsha Patil
```
📧 Email:    harsha@company.com
🔑 Password: password123
👔 Role:     Admin
🏢 Dept:     Administration
```

### 2. **HR** - Priya Sharma
```
📧 Email:    priya@company.com
🔑 Password: password123
👔 Role:     HR Manager
🏢 Dept:     Human Resources
```

### 3. **EMPLOYEE** - Rahul Kumar
```
📧 Email:    rahul@company.com
🔑 Password: password123
👔 Role:     Employee
🏢 Dept:     Engineering
```

### 4. **EMPLOYEE** - Anita Desai
```
📧 Email:    anita@company.com
🔑 Password: password123
👔 Role:     Employee
🏢 Dept:     Marketing
```

### 5. **EMPLOYEE** - Vikram Singh
```
📧 Email:    vikram@company.com
🔑 Password: password123
👔 Role:     Employee
🏢 Dept:     Sales
```

### 6. **EMPLOYEE** - Sneha Reddy
```
📧 Email:    sneha@company.com
🔑 Password: password123
👔 Role:     Employee
🏢 Dept:     Finance
```

---

## 🚀 Quick Start

### Login URL
```
http://localhost:3001
```

### Recommended Test Accounts

**To test Admin features:**
- Email: `harsha@company.com`
- Password: `password123`

**To test HR features:**
- Email: `priya@company.com`
- Password: `password123`

**To test Employee features:**
- Email: `rahul@company.com`
- Password: `password123`

---

## 🛠️ Database Management Scripts

### View All Credentials
```bash
cd backend
npm run show-credentials
```

### Reseed Database (Reset to default users)
```bash
cd backend
npm run seed
```

### Manual Scripts
```bash
# View credentials
node backend/scripts/showCredentials.js

# Seed database
node backend/scripts/seedDatabase.js
```

---

## 🔒 Security Notes

1. **Passwords are hashed** using bcrypt in the database
2. All passwords in development: `password123`
3. JWT tokens are used for authentication
4. Tokens expire after 7 days
5. Failed login attempts (3+) lock account for 1 minute

---

## 👥 Role Permissions

### ADMIN
- ✅ Full system access
- ✅ Add/edit/delete employees
- ✅ View all attendance records
- ✅ Approve/reject leave requests
- ✅ Access all messages
- ✅ System settings & branding
- ✅ Email template management

### HR
- ✅ Add/edit employees
- ✅ View attendance records
- ✅ Approve/reject leave requests
- ✅ Access messages
- ⛔ Cannot modify system settings

### EMPLOYEE
- ✅ Clock in/out
- ✅ Submit work summaries
- ✅ Request leave
- ✅ Send/receive messages
- ✅ Update own profile
- ⛔ Cannot view other employees' data
- ⛔ Cannot approve leave

---

## 📝 First Login Flow

When users log in for the first time:

1. **Login with credentials** (Email + `password123`)
2. **Force Password Change** - Must set a new password (different from `password123`)
3. **Set Date of Birth** (if not set)
4. **Redirected to Dashboard**

**All default users have `mustChangePassword: true`** - they MUST change their password on first login for security.

---

## 🎯 Testing Checklist

- [ ] Login as Admin
- [ ] Login as HR
- [ ] Login as Employee
- [ ] Test attendance tracking
- [ ] Test leave requests
- [ ] Test messaging
- [ ] Test profile updates
- [ ] Test admin settings

---

## 🔄 Reset Instructions

If you need to reset the database to defaults:

```bash
cd backend
npm run seed
```

This will:
- Clear all existing employees
- Create 6 default users (1 Admin, 1 HR, 4 Employees)
- Reset all passwords to `password123`

---

## 📞 Support

If you encounter any issues:
1. Check if MongoDB is running
2. Check if backend server is running on port 5000
3. Check if frontend is running on port 3001
4. Clear browser cache and localStorage
5. Run database seed script

---

**Last Updated:** November 4, 2025  
**Database:** MongoDB (hr-management)  
**Total Users:** 6
