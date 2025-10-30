# Backend Integration - Implementation Steps

## ✅ What's Been Done:

1. **API Service Created** (`src/services/api.js`)
   - Authentication API
   - Employee API
   - Attendance API
   - Leave API
   - Message API

2. **Component Updates Started:**
   - ✅ Imported API services
   - ✅ Added loading state
   - ✅ Updated login to use authAPI
   - ✅ Updated logout to clear token
   - ✅ Added useEffect hooks to fetch data
   - ✅ Updated handleStartWork to use API

## 🔄 Remaining Functions to Update:

### Update these functions in `HRManagementSystem.jsx`:

```javascript
// 1. Complete Work
const handleCompleteWork = async () => {
  if (!currentAttendance) return;
  const duration = Date.now() - currentAttendance.startTimestamp;
  const hours = Math.floor(duration / 3600000);
  const minutes = Math.floor((duration % 3600000) / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  const totalHours = `${hours}h ${minutes}m ${seconds}s`;
  
  try {
    await attendanceAPI.completeWork(currentAttendance.id, {
      endTime: new Date().toLocaleTimeString(),
      totalHours
    });
    
    setAttendanceRecords(prev => prev.map(r => 
      r.id === currentAttendance.id 
        ? { ...r, endTime: new Date().toLocaleTimeString(), totalHours, status: 'Completed' }
        : r
    ));
    setCurrentAttendance(null);
    showNotification('Work Completed', `Total hours: ${totalHours}`);
  } catch (error) {
    showNotification('Error', 'Failed to complete work');
  }
};

// 2. HR Clock In
const handleHRClockIn = async () => {
  try {
    await employeeAPI.clockIn(currentUser.id);
    setHrClockedIn(true);
    showNotification('Clocked In', 'Welcome! You can now access the portal.');
    
    const clockInNotification = {
      id: Date.now(),
      hrName: currentUser.name,
      hrEmail: currentUser.email,
      clockInTime: new Date().toLocaleTimeString(),
      clockInDate: new Date().toLocaleDateString(),
      timestamp: new Date().toLocaleString()
    };
    setHrClockInNotifications(prev => [...prev, clockInNotification]);
  } catch (error) {
    showNotification('Error', 'Failed to clock in');
  }
};

// 3. Leave Submit
const handleLeaveSubmit = async (e) => {
  e.preventDefault();
  if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
    showNotification('Error', 'Please fill all fields');
    return;
  }
  
  try {
    const leaveData = {
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      ...leaveForm,
      appliedDate: new Date().toLocaleDateString()
    };
    
    const response = await leaveAPI.submit(leaveData);
    setLeaveRequests(prev => [...prev, { ...response.leave, id: response.leave._id }]);
    setLeaveForm({ type: 'sick', startDate: '', endDate: '', reason: '' });
    showNotification('Success', 'Leave request submitted successfully');
  } catch (error) {
    showNotification('Error', error.response?.data?.error || 'Failed to submit leave');
  }
};

// 4. Approve Leave
const handleApproveLeave = async (leaveId) => {
  try {
    await leaveAPI.approve(leaveId);
    setLeaveRequests(prev => prev.map(l => 
      l.id === leaveId ? { ...l, status: 'approved' } : l
    ));
    showNotification('Success', 'Leave request approved');
  } catch (error) {
    showNotification('Error', 'Failed to approve leave');
  }
};

// 5. Reject Leave
const handleRejectLeave = async (leaveId) => {
  try {
    await leaveAPI.reject(leaveId);
    setLeaveRequests(prev => prev.map(l => 
      l.id === leaveId ? { ...l, status: 'rejected' } : l
    ));
    showNotification('Success', 'Leave request rejected');
  } catch (error) {
    showNotification('Error', 'Failed to reject leave');
  }
};

// 6. Send Message
const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!messageInput.trim() || !selectedContact) return;
  
  try {
    const messageData = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: selectedContact.id,
      message: messageInput,
      timestamp: new Date().toLocaleString()
    };
    
    const response = await messageAPI.send(messageData);
    setMessages(prev => [...prev, { ...response.data, id: response.data._id }]);
    setMessageInput('');
  } catch (error) {
    showNotification('Error', 'Failed to send message');
  }
};

// 7. Add Employee
const handleAddEmployee = async (e) => {
  e.preventDefault();
  if (!newEmployee.name || !newEmployee.email || !newEmployee.password || !newEmployee.department) {
    showNotification('Error', 'Please fill all fields');
    return;
  }
  if (newEmployee.password.length < 6) {
    showNotification('Error', 'Password must be at least 6 characters');
    return;
  }
  
  try {
    const response = await authAPI.register(newEmployee);
    setEmployees(prev => [...prev, { ...response.employee, id: response.employee._id }]);
    setShowAddEmployee(false);
    setNewEmployee({ name: '', email: '', password: '', role: 'employee', department: '' });
    showNotification('Success', `Employee ${response.employee.name} added successfully`);
  } catch (error) {
    showNotification('Error', error.response?.data?.error || 'Failed to add employee');
  }
};

// 8. Update Employee
const handleUpdateEmployee = async (e) => {
  e.preventDefault();
  if (!editEmployee.name || !editEmployee.email || !editEmployee.department) {
    showNotification('Error', 'Please fill all fields');
    return;
  }
  if (editEmployee.password && editEmployee.password.length < 6) {
    showNotification('Error', 'Password must be at least 6 characters');
    return;
  }
  
  try {
    const response = await employeeAPI.update(editEmployee.id, editEmployee);
    setEmployees(prev => prev.map(emp => 
      emp.id === editEmployee.id ? { ...response.employee, id: response.employee._id } : emp
    ));
    if (currentUser.id === editEmployee.id) {
      setCurrentUser({ ...response.employee, id: response.employee._id });
    }
    setShowEditEmployee(false);
    setEditEmployee(null);
    showNotification('Success', `Employee ${response.employee.name} updated successfully`);
  } catch (error) {
    showNotification('Error', error.response?.data?.error || 'Failed to update employee');
  }
};

// 9. Delete Employee
const handleDeleteEmployee = async (employeeId) => {
  if (!window.confirm('Are you sure you want to delete this employee?')) return;
  
  try {
    await employeeAPI.delete(employeeId);
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    showNotification('Success', 'Employee deleted successfully');
  } catch (error) {
    showNotification('Error', 'Failed to delete employee');
  }
};
```

## 📝 Additional Updates Needed:

### 1. Add Loading Indicator to Login Button:

```javascript
<button 
  type="submit" 
  disabled={loading || (lockoutTime && Date.now() < lockoutTime)}
  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? 'Signing In...' : lockoutTime && Date.now() < lockoutTime ? `Locked (${Math.ceil((lockoutTime - Date.now()) / 1000)}s)` : 'Sign In'}
</button>
```

### 2. Install axios in frontend:

```bash
npm install axios
```

### 3. Create .env file in root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start Backend Server:

```bash
cd backend
npm install
npm run seed
npm run dev
```

## 🎯 Testing Checklist:

- [ ] Login with backend credentials
- [ ] Fetch employees list
- [ ] Start/Complete work attendance
- [ ] Submit leave request
- [ ] Approve/Reject leave (HR/Admin)
- [ ] Send messages
- [ ] Add new employee (Admin)
- [ ] Edit employee (Admin)
- [ ] Delete employee (Admin)
- [ ] HR clock-in notification

## 🔧 Quick Fix for ID Mapping:

MongoDB uses `_id` but frontend uses `id`. The mapping is handled in useEffect hooks:

```javascript
.map(item => ({ ...item, id: item._id }))
```

## 📚 Resources:

- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`
- API Documentation: See `INTEGRATION_GUIDE.md`
