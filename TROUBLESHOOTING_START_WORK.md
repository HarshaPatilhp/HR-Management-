# 🔧 Troubleshooting: Start Work Not Working

## Quick Fixes

### **1. Check Backend Server is Running**

Open terminal and verify:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### **2. Check Frontend Environment Variable**

Verify `.env` file exists in root directory with:
```env
PORT=6000
REACT_APP_API_URL=http://localhost:5000/api
```

### **3. Restart Frontend**

If you just created `.env`, restart:
```bash
# Stop current server (Ctrl+C)
npm start
```

### **4. Check Browser Console**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Start Work"
4. Look for errors

**Expected logs:**
```
Starting work with data: {employeeId: "...", employeeName: "...", ...}
Start work response: {message: "Work started successfully", attendance: {...}}
```

**Common errors:**
- `Network Error` → Backend not running
- `404 Not Found` → Wrong API URL
- `500 Server Error` → Check backend console

### **5. Check Backend Console**

Look at backend terminal for errors when clicking "Start Work"

**Expected:**
```
POST /api/attendance/start 201
```

**If you see error:**
```
Start work error: ...
```
This shows the specific issue.

### **6. Test Backend Directly**

Test if backend is working:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","message":"HR Management System API is running"}
```

### **7. Check MongoDB Connection**

Backend terminal should show:
```
✅ MongoDB Connected
```

If not, check:
- MongoDB is running (`mongod`)
- Connection string in `backend/.env`

### **8. Clear Browser Cache**

Sometimes helps:
1. Open DevTools (F12)
2. Right-click refresh button
3. Choose "Empty Cache and Hard Reload"

### **9. Check Network Tab**

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Start Work"
4. Look for `/attendance/start` request

**Check:**
- Status: Should be `201 Created`
- Response: Should have `attendance` object
- Request Payload: Should have all required fields

### **10. Verify User is Logged In**

Make sure you're logged in:
- Check if `currentUser` exists
- Look for token in localStorage (DevTools → Application → Local Storage)

## Common Issues & Solutions

### **Issue 1: "Network Error"**
**Cause:** Backend not running
**Solution:** Start backend with `cd backend && npm run dev`

### **Issue 2: "Already clocked in today"**
**Cause:** You already started work today
**Solution:** 
- Check attendance records
- Or change date in database
- Or complete current work first

### **Issue 3: "Failed to start work"**
**Cause:** Generic error
**Solution:** Check backend console for specific error

### **Issue 4: Button doesn't respond**
**Cause:** JavaScript error
**Solution:** Check browser console for errors

### **Issue 5: "Cannot read property 'id' of undefined"**
**Cause:** User not properly logged in
**Solution:** Logout and login again

## Debug Mode

Add this to see more details:

**In browser console:**
```javascript
localStorage.getItem('token') // Should show JWT token
```

**Check API URL:**
```javascript
console.log(process.env.REACT_APP_API_URL)
// Should show: http://localhost:5000/api
```

## Still Not Working?

1. **Check all servers are running:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:6000`
   - MongoDB: Running locally or Atlas

2. **Restart everything:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm start
   ```

3. **Check the logs:**
   - Browser Console (F12)
   - Backend Terminal
   - Network Tab in DevTools

4. **Test with different user:**
   - Logout
   - Login with different account
   - Try start work again

## Expected Behavior

When "Start Work" button is clicked:

1. ✅ Button is clicked
2. ✅ Frontend sends POST request to `/api/attendance/start`
3. ✅ Backend receives request
4. ✅ Backend saves to MongoDB
5. ✅ Backend returns attendance record
6. ✅ Frontend updates UI
7. ✅ "Complete Work" button appears
8. ✅ Notification shows "Work Started"

If any step fails, check that specific step!

## Quick Test

Run this in browser console after logging in:
```javascript
fetch('http://localhost:5000/api/attendance/start', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({
    employeeId: 'YOUR_USER_ID',
    employeeName: 'Test User',
    date: new Date().toLocaleDateString(),
    startTime: new Date().toLocaleTimeString(),
    startTimestamp: Date.now()
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

This will show if the API is working!
