# 🚀 HR Management System - Quick Start Guide

## ✅ All Users Now Require Password Change on First Login!

### 📋 Current User Accounts

All 6 users are ready with these credentials:

| Email                  | Initial Password | Role     |
|------------------------|------------------|----------|
| harsha@company.com     | password123      | Admin    |
| priya@company.com      | password123      | HR       |
| rahul@company.com      | password123      | Employee |
| anita@company.com      | password123      | Employee |
| vikram@company.com     | password123      | Employee |
| sneha@company.com      | password123      | Employee |

---

## 🔐 First Login Process

### Step-by-Step:

1. **Go to:** http://localhost:3001

2. **Login with:**
   - Email: `harsha@company.com`
   - Password: `password123`

3. **Force Password Change Screen Appears:**
   ```
   ⚠️ You MUST change your password to continue
   ```
   - Enter current password: `password123`
   - Enter NEW password: `YourNewPassword123` (min 6 characters)
   - Confirm new password: `YourNewPassword123`
   - Click "Change Password & Continue"

4. **Set Date of Birth:**
   ```
   🎂 Welcome to the Team!
   Please share your date of birth
   ```
   - Select your date of birth
   - Click "Continue to Dashboard"

5. **Welcome to the Dashboard! 🎉**

---

## 🔄 Password Requirements

- ✅ Minimum 6 characters
- ✅ Must be different from current password (`password123`)
- ✅ Must match confirmation field
- ✅ Cannot be the same as old password

---

## 🎯 What to Test

### As Admin (harsha@company.com):
- [ ] Force password change on first login
- [ ] Set date of birth
- [ ] View dashboard
- [ ] Add new employee
- [ ] View all attendance records
- [ ] Upload company logo (Settings → Branding)
- [ ] Customize email templates (Settings → Email Templates)

### As HR (priya@company.com):
- [ ] Force password change
- [ ] Set date of birth
- [ ] View employee list
- [ ] Approve/reject leave requests

### As Employee (rahul@company.com):
- [ ] Force password change
- [ ] Set date of birth
- [ ] Clock in/out
- [ ] Submit work summary
- [ ] Request leave
- [ ] Send messages

---

## 🛠️ Useful Commands

### View All Credentials:
```bash
cd backend
npm run show-credentials
```

### Reset Database:
```bash
cd backend
node scripts/clearAndSeed.js
```

### Check if Servers are Running:
- Frontend: http://localhost:3001 (React app)
- Backend: http://localhost:5000 (Express API)

---

## ❓ Troubleshooting

### "Password is wrong"
- Make sure you're using `password123` for first-time login
- Database might not be seeded - run: `node backend/scripts/clearAndSeed.js`

### Force Password Change Not Showing
- All users now have `mustChangePassword: true`
- Try logging out and back in
- Database has been re-seeded with correct settings

### DOB Modal Not Closing
- This has been fixed
- Modal now closes after successful DOB update
- You'll see success notification

---

## 🎨 New Features Added

✅ **Company Branding**
- Upload company logo (Admin only)
- Set company name
- Logo appears in navbar and login page

✅ **Professional Email Templates**
- 8 pre-written professional templates
- Customizable subject and body
- Placeholder support ({{employeeName}}, etc.)

✅ **Enhanced Settings**
- Profile management
- Security (password change)
- System settings (Admin only)

---

## 📞 Current Status

✅ MongoDB: Connected (hr_management database)  
✅ Backend: Running on port 5000  
✅ Frontend: Running on port 3001  
✅ Users: 6 accounts created  
✅ Force Password Change: **ENABLED**  
✅ Date of Birth Modal: **FIXED**

---

**Ready to Login!** 🚀

Go to http://localhost:3001 and start with:
- Email: `harsha@company.com`
- Password: `password123`

You'll be prompted to change your password immediately! 🔐
