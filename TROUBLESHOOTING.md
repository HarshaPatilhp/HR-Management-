# 🔧 Troubleshooting Guide - HR Management System

## ✅ Messages Are Working!

**Status:** Messages are sending and receiving correctly in the application.

---

## 💬 Message System Status

### Working Features:
✅ **Send Messages** - Working perfectly  
✅ **Receive Messages** - Real-time updates every 3 seconds  
✅ **Read Receipts** - Bright cyan checkmarks when read  
✅ **Unread Counter** - Shows unread message count  
✅ **Auto-mark as Read** - When opening conversation  

### Recent Activity:
```
💬 MESSAGE SENT:
   From: Aditi
   To: 6909b29c6d715bd166b4bb53
   Message: hii
   Status: ✅ Successful
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Messages not sending"
**Symptoms:**
- Error message appears when sending
- Message doesn't show in chat

**Solutions:**
1. **Check if you're logged in:**
   - Make sure you completed login
   - Check if user profile is loaded

2. **Select a contact:**
   - You must select someone from the contact list
   - Cannot send messages without a recipient

3. **Check backend is running:**
   ```bash
   # Should see:
   🚀 Server running on port 5000
   ✅ MongoDB Connected
   ```

4. **Refresh the page:**
   - Press F5 or Ctrl+R
   - Re-login if necessary

---

### Issue 2: "Not receiving messages"
**Symptoms:**
- Sent messages don't appear
- Can't see messages from others

**Solutions:**
1. **Wait 3 seconds:**
   - Messages auto-refresh every 3 seconds
   - Be patient for real-time updates

2. **Check Messages tab:**
   - Go to Messages section
   - Select the contact you messaged

3. **Verify backend connection:**
   ```bash
   cd backend
   npm run test-db
   ```

---

### Issue 3: "Read receipts not updating"
**Symptoms:**
- Checkmarks stay gray
- Don't turn cyan when read

**Solutions:**
1. **Recipient must open chat:**
   - They need to click on your conversation
   - Read status updates when they view messages

2. **Wait for polling:**
   - Updates happen every 3 seconds
   - Give it a moment to sync

3. **Check both users are online:**
   - Both sender and receiver should be logged in
   - Messages batch-marked as read on view

---

### Issue 4: "Error 500 when sending"
**Cause:** Usually a database connection issue

**Solutions:**
1. **Check MongoDB is running:**
   ```powershell
   Get-Service MongoDB
   # Should show: Running
   ```

2. **Restart MongoDB if needed:**
   ```powershell
   net stop MongoDB
   net start MongoDB
   ```

3. **Verify database connection:**
   ```bash
   cd backend
   npm run test-db
   ```

4. **Check backend logs:**
   - Look for error messages in terminal
   - Common issues: Connection timeout, Invalid ObjectId

---

### Issue 5: "Can't see contact list"
**Symptoms:**
- Contact list empty
- No one to message

**Solutions:**
1. **Check if employees exist:**
   ```bash
   cd backend
   npm run show-credentials
   ```

2. **Seed database if empty:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Refresh employee list:**
   - Go to Dashboard
   - Come back to Messages
   - List should reload

---

## 🔍 How to Check if Messages are Working

### Quick Test:
1. Open two browsers (Chrome + Edge/Incognito)
2. Login as User A in Chrome
3. Login as User B in Edge
4. User A sends message to User B
5. Wait 3 seconds
6. User B sees message
7. User B opens conversation
8. User A sees cyan checkmarks ✓✓

---

## 📊 Backend Health Check

### Check Server Status:
```bash
# Backend should show:
🚀 Server running on port 5000
✅ MongoDB Connected

# When messages are sent:
💬 MESSAGE SENT:
   From: [Name]
   To: [ID]
   Message: [text]
```

### Verify Routes:
- `POST /api/messages` - Send message
- `GET /api/messages?userId=xxx` - Get messages
- `PUT /api/messages/mark-read-batch` - Mark as read

---

## 🛠️ Developer Tools

### Check Browser Console (F12):
**Look for:**
- ✅ No red errors
- ✅ API calls returning 200/201
- ✅ Messages array populating

**Common errors:**
- `401 Unauthorized` - Not logged in
- `500 Server Error` - Backend issue
- `Network Error` - Backend not running

### Check Network Tab:
1. Open DevTools (F12)
2. Go to Network tab
3. Send a message
4. Look for `POST /api/messages`
5. Should return `201 Created`

---

## ✅ Expected Behavior

### Sending a Message:
```
1. Type message
2. Click Send or press Enter
3. Message appears immediately
4. Shows single gray checkmark ✓
5. Becomes double gray ✓✓ (delivered)
6. Turns bright cyan ✓✓ when read
```

### Receiving a Message:
```
1. Message arrives (within 3 seconds)
2. Unread counter increases
3. Open conversation
4. Message marked as read automatically
5. Sender sees cyan checkmarks
```

---

## 🚨 Emergency Fixes

### Nuclear Option - Reset Everything:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Reset database
cd backend
npm run seed

# 3. Clear browser cache
# Press Ctrl+Shift+Delete
# Clear all cache and data

# 4. Restart backend
cd backend
npm run dev

# 5. Restart frontend
# In root folder
npm start

# 6. Re-login
# Use fresh credentials from seed
```

---

## 📞 Still Having Issues?

### Checklist:
- [ ] MongoDB service running
- [ ] Backend server running (port 5000)
- [ ] Frontend app running (port 3001)
- [ ] Logged in successfully
- [ ] Database has users
- [ ] Contact selected
- [ ] Message not empty

### Get Help:
1. Check terminal for error messages
2. Check browser console (F12)
3. Check backend logs
4. Run test scripts
5. Try with different users

---

## ✅ Current System Status

**As of last check:**
```
✅ Backend: Running
✅ MongoDB: Connected
✅ Messages: Working
✅ Read Receipts: Active (Cyan color)
✅ Real-time Updates: 3-second polling
✅ Batch Read: Implemented
✅ Route Order: Fixed
```

**Recent Messages:**
- Aditi → User: "hii" ✅ Sent successfully

---

## 🎯 Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Can't send | Check if contact selected |
| Not receiving | Wait 3 seconds for refresh |
| No checkmarks | Recipient must open chat |
| Error 500 | Restart MongoDB service |
| Empty contacts | Run `npm run seed` |
| General issues | Refresh page (F5) |

---

**Messages ARE working!** 🎉

If you see this message from backend:
```
💬 MESSAGE SENT:
   From: [Your Name]
   ...
```

Then it's working perfectly! The error you saw was just from the test script using invalid data format, not from the real application.

**Go ahead and try sending messages - they will work!** ✓✓
