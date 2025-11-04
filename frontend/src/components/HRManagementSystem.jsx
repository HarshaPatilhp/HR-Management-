import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Clock, Calendar, MessageSquare, Settings, LogOut, CheckCircle, AlertCircle, Search, Send, Camera, Upload, UserPlus, Trash2, Eye, EyeOff, Bell, X, Mail, Palette, FileText, Building2 } from 'lucide-react';
import { authAPI, employeeAPI, attendanceAPI, leaveAPI, messageAPI, settingsAPI } from '../services/api';

const HRManagementSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState({});
  const [lockoutTime, setLockoutTime] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  // Removed unused state: showNotificationsPanel
  const [hrClockedIn, setHrClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveForm, setLeaveForm] = useState({ type: 'sick', startDate: '', endDate: '', reason: '' });
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [settingsTab, setSettingsTab] = useState('profile');
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarTab, setAvatarTab] = useState('preset');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', role: 'employee', department: '' });
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [hrClockInNotifications, setHrClockInNotifications] = useState([]);
  const [viewedHrNotifications, setViewedHrNotifications] = useState([]);
  const [showForcePasswordChange, setShowForcePasswordChange] = useState(false);
  const [forcePasswordForm, setForcePasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [forcePasswordError, setForcePasswordError] = useState('');
  const [showWorkSummaryModal, setShowWorkSummaryModal] = useState(false);
  const [workSummary, setWorkSummary] = useState('');
  const [workSummaryError, setWorkSummaryError] = useState('');
  const [workCompletionNotifications, setWorkCompletionNotifications] = useState([]);
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // 'all', 'active', 'completed'
  const [leaveFilter, setLeaveFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [searchEmployee, setSearchEmployee] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [attendanceEmployeeSearch, setAttendanceEmployeeSearch] = useState('');
  const [showDOBModal, setShowDOBModal] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dobError, setDobError] = useState('');
  const [showBirthdayWish, setShowBirthdayWish] = useState(false);
  const [birthdayEmployees, setBirthdayEmployees] = useState([]);
  const [viewedNotifications, setViewedNotifications] = useState({ birthdays: [], workReports: [] });
  const [showWorkSummaryDetailsModal, setShowWorkSummaryDetailsModal] = useState(false);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
  const [showDeleteHistoryConfirm, setShowDeleteHistoryConfirm] = useState(false);
  const [showDeleteRecordConfirm, setShowDeleteRecordConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [systemSettings, setSystemSettings] = useState(null);
  const [companyLogo, setCompanyLogo] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const chatEndRef = useRef(null);
  const presetAvatars = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🔧', '👩‍🔧', '👨‍🎨', '👩‍🎨', '👨‍🏫', '👩‍🏫', '👨‍⚕️', '👩‍⚕️', '👨‍🚀', '👩‍🚀', '🧑‍💼'];
  const [selectedEmployeeForPicChange, setSelectedEmployeeForPicChange] = useState(null);

  useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutTime) { setLockoutTime(null); setFailedAttempts({}); }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  useEffect(() => {
    if (currentUser && notificationPermission === 'default' && 'Notification' in window) {
      Notification.requestPermission().then(permission => setNotificationPermission(permission));
    }
  }, [currentUser, notificationPermission]);

  const markMessagesAsRead = useCallback(async (contactId) => {
    // Get unread messages from this contact
    const unreadMessages = messages.filter(msg =>
      msg.senderId === contactId && 
      msg.receiverId === currentUser?.id && 
      !msg.read
    );
    
    if (unreadMessages.length > 0) {
      try {
        // Mark as read in backend
        const messageIds = unreadMessages.map(msg => msg.id);
        await messageAPI.markAsReadBatch(messageIds);
        
        // Update local state
        setMessages(prev => prev.map(msg =>
          msg.senderId === contactId && msg.receiverId === currentUser?.id
            ? { ...msg, read: true, readAt: new Date() }
            : msg
        ));
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  }, [messages, currentUser?.id]);

  useEffect(() => {
    if (selectedContact) {
      markMessagesAsRead(selectedContact.id);
    }
  }, [selectedContact, markMessagesAsRead]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (currentUser) {
        try {
          const data = await employeeAPI.getAll();
          setEmployees(data.map(emp => ({
            ...emp,
            id: emp._id,
            profilePic: emp.profilePic || '👨‍💼'
          })));
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      }
    };
    fetchEmployees();
  }, [currentUser]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (currentUser) {
        try {
          const employeeId = currentUser.role === 'employee' ? currentUser.id : null;
          const data = await attendanceAPI.getAll(employeeId);
          setAttendanceRecords(data.map(record => ({
            ...record,
            id: record._id,
            employeeId: record.employeeId
          })));
        } catch (error) {
          console.error('Error fetching attendance:', error);
        }
      }
    };
    fetchAttendance();
  }, [currentUser]);

  useEffect(() => {
    const fetchLeaves = async () => {
      if (currentUser) {
        try {
          const data = await leaveAPI.getAll(currentUser.id);
          setLeaveRequests(data.map(leave => ({
            ...leave,
            id: leave._id,
            employeeId: leave.employeeId
          })));
        } catch (error) {
          console.error('Error fetching leaves:', error);
        }
      }
    };
    fetchLeaves();
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser) {
        try {
          const data = await messageAPI.getAll(currentUser.id);
          setMessages(data.map(msg => ({
            ...msg,
            id: msg._id,
          })));
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
    
    fetchMessages();
    
    // Poll for new messages every 3 seconds
    const messageInterval = setInterval(fetchMessages, 3000);
    
    return () => clearInterval(messageInterval);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin' && activeSection === 'attendance') {
      const todayNotifications = hrClockInNotifications.filter(n => n.clockInDate === new Date().toLocaleDateString());
      const notificationIds = todayNotifications.map(n => n.id);
      setViewedHrNotifications(prev => [...new Set([...prev, ...notificationIds])]);
    }
  }, [activeSection, currentUser, hrClockInNotifications]);

  useEffect(() => {
    if (currentUser && employees.length > 0) {
      const today = new Date();
      const todayMonth = today.getMonth();
      const todayDate = today.getDate();
      
      const birthdayPeople = employees.filter(emp => {
        if (emp.dateOfBirth) {
          const empDOB = new Date(emp.dateOfBirth);
          return empDOB.getMonth() === todayMonth && empDOB.getDate() === todayDate;
        }
        return false;
      });
      
      setBirthdayEmployees(birthdayPeople);
      
      if (birthdayPeople.length > 0 && notificationPermission === 'granted') {
        birthdayPeople.forEach(emp => {
          if (emp.id !== currentUser.id) {
            new Notification(`🎂 Birthday Today!`, {
              body: `It's ${emp.name}'s birthday! Wish them a happy birthday! 🎉`,
              icon: emp.profilePic || '🎂'
            });
          }
        });
      }
    }
  }, [employees, currentUser, notificationPermission]);

  useEffect(() => {
    if (activeSection === 'notifications') {
      const birthdayIds = birthdayEmployees.map(emp => emp.id);
      const todayWorkReportIds = workCompletionNotifications
        .filter(n => n.date === new Date().toLocaleDateString())
        .map(n => n.id);
      
      setViewedNotifications({
        birthdays: birthdayIds,
        workReports: todayWorkReportIds
      });
    }
  }, [activeSection, birthdayEmployees, workCompletionNotifications]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.get();
        setSystemSettings(data);
        setCompanyLogo(data.companyLogo || '');
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const showNotification = (title, body) => {
    const notif = { id: Date.now(), title, body };
    setNotifications(prev => [...prev, notif]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notif.id)), 5000);
    if (notificationPermission === 'granted' && 'Notification' in window) {
      new Notification(title, { body, icon: currentUser?.profilePic || '🔔' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    
    if (lockoutTime && Date.now() < lockoutTime) {
      setLoginError(`Account locked. Try again in ${Math.ceil((lockoutTime - Date.now()) / 1000)} seconds.`);
      setLoading(false);
      return;
    }
    
    if (loginPassword.length < 6) {
      setLoginError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      const data = await authAPI.login(loginEmail, loginPassword);
      const user = {
        ...data.user,
        id: data.user.id || data.user._id
      };
      
      setCurrentUser(user);
      setLoginEmail('');
      setLoginPassword('');
      setFailedAttempts({});
      setLockoutTime(null);
      
      if (user.mustChangePassword) {
        setShowForcePasswordChange(true);
      } else if (!user.dateOfBirth) {
        setShowDOBModal(true);
      } else {
        const today = new Date();
        const userDOB = new Date(user.dateOfBirth);
        const isBirthday = today.getMonth() === userDOB.getMonth() && today.getDate() === userDOB.getDate();
        
        if (isBirthday) {
          setShowBirthdayWish(true);
          setTimeout(() => setShowBirthdayWish(false), 5000);
        }
        showNotification('Welcome!', `Hello ${user.name}, you're now logged in.`);
      }
    } catch (error) {
      const attempts = (failedAttempts[loginEmail] || 0) + 1;
      setFailedAttempts({ ...failedAttempts, [loginEmail]: attempts });
      
      if (attempts >= 3) {
        setLockoutTime(Date.now() + 60000);
        setLoginError('Too many failed attempts. Account locked for 1 minute.');
      } else {
        const errorMsg = error.response?.data?.error || 'Login failed';
        setLoginError(`${errorMsg}. ${3 - attempts} attempts remaining.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setActiveSection('dashboard');
    setHrClockedIn(false);
    setCurrentAttendance(null);
    setEmployees([]);
    setAttendanceRecords([]);
    setLeaveRequests([]);
    setMessages([]);
  };

  const handleStartWork = async () => {
    try {
      const today = new Date().toLocaleDateString();
      const now = new Date();
      
      console.log('Current user:', currentUser);
      console.log('Existing attendance records:', attendanceRecords);
      
      // Check if already clocked in today
      const existingRecord = attendanceRecords.find(r => 
        r.employeeId === currentUser.id && r.date === today
      );
      
      if (existingRecord) {
        console.log('Existing record found:', existingRecord);
        showNotification('Already Clocked In', 'You have already started work today.');
        return;
      }

      // Prepare attendance data with all required fields
      const attendanceData = {
        employeeId: currentUser.id,
        employeeName: currentUser.name || 'Unknown User',
        date: today,
        startTime: now.toLocaleTimeString(),
        startTimestamp: now.getTime(),
        status: 'In Progress'
      };
      
      console.log('Attempting to start work with data:', attendanceData);
      
      // Make sure token is present
      const token = localStorage.getItem('token');
      console.log('Auth token present:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      try {
        const response = await fetch('/api/attendance/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(attendanceData)
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', { status: response.status, statusText: response.statusText, text });
          throw new Error('Server returned an invalid response. Please try again.');
        }

        const responseData = await response.json();
        console.log('Server response:', { status: response.status, data: responseData });
        
        if (!response.ok) {
          throw new Error(responseData.error || `Server responded with status ${response.status}`);
        }
        
        // Create a new attendance record for the UI
        const newAttendance = {
          ...responseData.attendance,
          id: responseData.attendance._id || responseData.attendance.id,
          employeeId: responseData.attendance.employeeId,
          date: responseData.attendance.date || today,
          startTime: responseData.attendance.startTime || now.toLocaleTimeString(),
          status: responseData.attendance.status || 'In Progress'
        };
        
        console.log('Created new attendance record:', newAttendance);
        
        // Update the state
        setAttendanceRecords(prev => [...prev, newAttendance]);
        setCurrentAttendance(newAttendance);
        showNotification('Work Started', 'Your attendance has been recorded successfully.');
        
      } catch (apiError) {
        console.error('API Error:', {
          message: apiError.message,
          stack: apiError.stack,
          response: apiError.response
        });
        throw apiError;
      }
      
    } catch (error) {
      console.error('Start work error:', error);
      let errorMsg = error.message || 'Failed to start work. Please try again.';
      
      // Check for common error cases
      if (error.message.includes('token') || 
          error.message.includes('authentication') ||
          error.message.includes('401') ||
          error.message.includes('403')) {
        errorMsg = 'Your session has expired. Please log in again.';
        // Force logout
        localStorage.removeItem('token');
        setCurrentUser(null);
        showNotification('Session Expired', errorMsg, 'error');
      } else if (error.message.includes('NetworkError')) {
        errorMsg = 'Unable to connect to the server. Please check your connection.';
        showNotification('Connection Error', errorMsg, 'error');
      } else {
        showNotification('Error', errorMsg, 'error');
      }
    }
  };

  const handleCompleteWork = () => {
    if (!currentAttendance) return;
    setShowWorkSummaryModal(true);
    setWorkSummary('');
    setWorkSummaryError('');
  };

  const handleForceStopWork = async (employeeId, attendanceId) => {
    if (!attendanceId || !window.confirm(`Are you sure you want to force stop work for this employee? This action cannot be undone.`)) {
      return;
    }

    try {
      // Call the API to force stop the work session
      const response = await fetch(`/api/attendance/${attendanceId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          endTime: new Date().toLocaleTimeString(),
          totalHours: '0h 0m 0s',
          workSummary: 'Session force stopped by admin',
          forceStopped: true
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to force stop work session');
      }

      // Update the UI
      setAttendanceRecords(prev => 
        prev.map(record => 
          record.id === attendanceId 
            ? { 
                ...record, 
                endTime: new Date().toLocaleTimeString(),
                totalHours: '0h 0m 0s',
                workSummary: 'Session force stopped by admin',
                status: 'Force Stopped'
              }
            : record
        )
      );
      
      // If it's the current user's attendance, update currentAttendance
      if (currentAttendance?.id === attendanceId) {
        setCurrentAttendance(null);
      }
      
      showNotification('Work Stopped', `Work session has been force stopped.`, 'warning');
      
    } catch (error) {
      console.error('Error force stopping work:', error);
      showNotification('Error', error.message || 'Failed to force stop work session. Please try again.');
    }
  };

  const handleSubmitWorkSummary = async (e) => {
    e.preventDefault();
    setWorkSummaryError('');
    
    if (!workSummary || workSummary.trim().length < 10) {
      setWorkSummaryError('Please provide a detailed work summary (at least 10 characters)');
      return;
    }
    
    if (!currentAttendance) return;
    
    const duration = Date.now() - currentAttendance.startTimestamp;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    const totalHours = `${hours}h ${minutes}m ${seconds}s`;
    
    try {
      const response = await attendanceAPI.completeWork(currentAttendance.id, {
        endTime: new Date().toLocaleTimeString(),
        totalHours,
        workSummary: workSummary.trim(),
        tasksCompleted: workSummary.trim()
      });
      
      const completedRecord = {
        ...currentAttendance,
        endTime: new Date().toLocaleTimeString(),
        totalHours,
        workSummary: workSummary.trim(),
        status: 'Completed'
      };
      
      setAttendanceRecords(prev => prev.map(r => 
        r.id === currentAttendance.id ? completedRecord : r
      ));
      
      const notification = {
        id: Date.now(),
        employeeName: currentUser.name,
        employeeId: currentUser.id,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        totalHours,
        workSummary: workSummary.trim(),
        timestamp: new Date().toLocaleString()
      };
      setWorkCompletionNotifications(prev => [...prev, notification]);
      
      setCurrentAttendance(null);
      setShowWorkSummaryModal(false);
      setWorkSummary('');
      showNotification('Work Completed', `Total hours: ${totalHours}. Summary submitted to admin.`);
    } catch (error) {
      setWorkSummaryError(error.response?.data?.error || 'Failed to complete work');
    }
  };

  const handleViewWorkSummary = (record) => {
    setSelectedAttendanceRecord(record);
    setShowWorkSummaryDetailsModal(true);
  };

  const handleDeleteSingleRecord = async () => {
    if (!recordToDelete) return;
    
    try {
      setLoading(true);
      await attendanceAPI.deleteRecord(recordToDelete.id);
      setAttendanceRecords(prev => prev.filter(r => r.id !== recordToDelete.id));
      
      // If deleting current attendance, clear it
      if (currentAttendance?.id === recordToDelete.id) {
        setCurrentAttendance(null);
      }
      
      setShowDeleteRecordConfirm(false);
      setRecordToDelete(null);
      showNotification('Record Deleted', `Attendance record for ${recordToDelete.employeeName} on ${recordToDelete.date} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      showNotification('Error', error.response?.data?.error || 'Failed to delete attendance record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttendanceHistory = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.deleteHistory();
      setAttendanceRecords([]);
      setCurrentAttendance(null);
      setShowDeleteHistoryConfirm(false);
      showNotification('History Deleted', `${response.deletedCount} attendance records deleted successfully.`);
    } catch (error) {
      console.error('Error deleting attendance history:', error);
      showNotification('Error', error.response?.data?.error || 'Failed to delete attendance history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      
      // Create notification for admin only
      const adminNotification = {
        id: Date.now(),
        title: 'New Leave Request',
        body: `${currentUser.name} has submitted a leave request (${leaveData.type})`,
        type: 'leave_request',
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        leaveType: leaveData.type,
        appliedDate: leaveData.appliedDate
      };
      setNotifications(prev => [...prev, adminNotification]);
      
      showNotification('Leave Applied', 'Your leave request has been submitted.');
    } catch (error) {
      showNotification('Error', error.response?.data?.error || 'Failed to submit leave');
    }
  };

  const handleLeaveAction = async (leaveId, action) => {
    const leave = leaveRequests.find(l => l.id === leaveId);
    if (leave.employeeId === currentUser.id) {
      showNotification('Error', 'You cannot approve your own leave request.');
      return;
    }
    
    try {
      if (action === 'approved') {
        await leaveAPI.approve(leaveId);
      } else {
        await leaveAPI.reject(leaveId);
      }
      
      setLeaveRequests(prev => prev.map(l => l.id === leaveId ? { ...l, status: action } : l));
      
      // Create notification for the employee
      const employeeNotification = {
        id: Date.now(),
        title: `Leave ${action === 'approved' ? 'Approved' : 'Rejected'}`,
        body: `Your leave request (${leave.type}) has been ${action}`,
        type: 'leave_response',
        leaveId: leaveId,
        action: action,
        leaveType: leave.type
      };
      setNotifications(prev => [...prev, employeeNotification]);
      
      showNotification('Leave ' + (action === 'approved' ? 'Approved' : 'Rejected'), `Leave request for ${leave.employeeName} has been ${action}.`);
    } catch (error) {
      showNotification('Error', 'Failed to update leave status');
    }
  };

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
      const newMessage = { ...response.data, id: response.data._id };
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      
      // Scroll to bottom
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Error', 'Failed to send message. Please try again.');
    }
  };

  const getContactMessages = (contactId) => 
    messages.filter(msg => 
      (msg.senderId === currentUser.id && msg.receiverId === contactId) || 
      (msg.senderId === contactId && msg.receiverId === currentUser.id)
    ).sort((a, b) => a.id - b.id);
    
  const getLastMessage = (contactId) => { 
    const contactMessages = getContactMessages(contactId); 
    return contactMessages[contactMessages.length - 1]; 
  };
  
  const getUnreadCount = (contactId) => 
    messages.filter(msg => 
      msg.senderId === contactId && 
      msg.receiverId === currentUser?.id &&
      !msg.read
    ).length;

  const filteredContacts = employees.filter(emp => 
    emp.id !== currentUser?.id && 
    (emp.name.toLowerCase().includes(searchContact.toLowerCase()) || 
     emp.department?.toLowerCase().includes(searchContact.toLowerCase()))
  );

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.current !== currentUser.password) { showNotification('Error', 'Current password is incorrect'); return; }
    if (passwordForm.new.length < 6) { showNotification('Error', 'New password must be at least 6 characters'); return; }
    if (passwordForm.current === passwordForm.new) { showNotification('Error', 'New password must be different from current password'); return; }
    if (passwordForm.new !== passwordForm.confirm) { showNotification('Error', 'Passwords do not match'); return; }
    setEmployees(prev => prev.map(emp => emp.id === currentUser.id ? { ...emp, password: passwordForm.new } : emp));
    setCurrentUser({ ...currentUser, password: passwordForm.new });
    setPasswordForm({ current: '', new: '', confirm: '' });
    showNotification('Success', 'Password changed successfully');
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      showNotification('Error', 'Logo file size must be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setUploadingLogo(true);
        const newSettings = {
          ...systemSettings,
          companyLogo: reader.result
        };
        await settingsAPI.update(newSettings);
        setSystemSettings(newSettings);
        setCompanyLogo(reader.result);
        showNotification('Success', 'Company logo updated successfully');
      } catch (error) {
        console.error('Error uploading logo:', error);
        showNotification('Error', 'Failed to upload logo. Please try again.');
      } finally {
        setUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = async () => {
    try {
      setUploadingLogo(true);
      const newSettings = {
        ...systemSettings,
        companyLogo: ''
      };
      await settingsAPI.update(newSettings);
      setSystemSettings(newSettings);
      setCompanyLogo('');
      showNotification('Success', 'Company logo removed successfully');
    } catch (error) {
      console.error('Error removing logo:', error);
      showNotification('Error', 'Failed to remove logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSystemSettingsUpdate = async (updates) => {
    try {
      const newSettings = {
        ...systemSettings,
        ...updates
      };
      await settingsAPI.update(newSettings);
      setSystemSettings(newSettings);
      showNotification('Success', 'Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      showNotification('Error', 'Failed to update settings. Please try again.');
    }
  };

  const handleDOBSubmit = async (e) => {
    e.preventDefault();
    setDobError('');
    
    if (!dateOfBirth) {
      setDobError('Please select your date of birth');
      return;
    }
    
    if (!currentUser || !currentUser.id) {
      setDobError('User session error. Please try logging in again.');
      return;
    }
    
    const selectedDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    
    if (age < 18 || age > 100) {
      setDobError('Please enter a valid date of birth (age must be between 18-100)');
      return;
    }
    
    try {
      await authAPI.updateDOB(currentUser.id, dateOfBirth);
      const updatedUser = { ...currentUser, dateOfBirth };
      setCurrentUser(updatedUser);
      
      // Close the DOB modal
      setShowDOBModal(false);
      setDateOfBirth('');
      
      // Check if today is birthday
      const isBirthday = today.getMonth() === selectedDate.getMonth() && today.getDate() === selectedDate.getDate();
      
      if (isBirthday) {
        setShowBirthdayWish(true);
        setTimeout(() => setShowBirthdayWish(false), 5000);
      }
      
      showNotification('Success', 'Date of birth updated successfully! Welcome to the system.');
    } catch (error) {
      console.error('Error updating DOB:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update date of birth. Please try again.';
      setDobError(errorMessage);
    }
  };

  const handleForcePasswordChange = async (e) => {
    e.preventDefault();
    setForcePasswordError('');
    
    if (!forcePasswordForm.current || !forcePasswordForm.new || !forcePasswordForm.confirm) {
      setForcePasswordError('Please fill all fields');
      return;
    }
    
    if (forcePasswordForm.new.length < 6) {
      setForcePasswordError('New password must be at least 6 characters');
      return;
    }
    
    if (forcePasswordForm.current === forcePasswordForm.new) {
      setForcePasswordError('New password must be different from current password');
      return;
    }
    
    if (forcePasswordForm.new !== forcePasswordForm.confirm) {
      setForcePasswordError('New passwords do not match');
      return;
    }
    
    try {
      await authAPI.changePassword(currentUser.id, forcePasswordForm.current, forcePasswordForm.new);
      const updatedUser = { ...currentUser, mustChangePassword: false };
      setCurrentUser(updatedUser);
      setShowForcePasswordChange(false);
      setForcePasswordForm({ current: '', new: '', confirm: '' });
      
      // Check if DOB is set, if not show DOB modal
      if (!updatedUser.dateOfBirth) {
        setShowDOBModal(true);
      } else {
        showNotification('Success', 'Password changed successfully! Welcome to the system.');
      }
    } catch (error) {
      setForcePasswordError(error.response?.data?.error || 'Failed to change password');
    }
  };

  const handleAvatarSave = async () => {
    const targetUser = selectedEmployeeForPicChange || currentUser;
    let newProfilePic = currentUser.profilePic;
    if (avatarTab === 'preset' && selectedAvatar) newProfilePic = selectedAvatar;
    else if (avatarTab === 'upload' && uploadedImage) newProfilePic = uploadedImage;
    
    try {
      // Update profile picture in backend
      await employeeAPI.update(targetUser.id, {
        ...targetUser,
        profilePic: newProfilePic
      });
      
      // Update local state
      const updatedUser = { ...targetUser, profilePic: newProfilePic };
      setEmployees(prev => prev.map(emp => emp.id === targetUser.id ? updatedUser : emp));
      
      if (targetUser.id === currentUser.id) {
        setCurrentUser(updatedUser);
      }
      
      // Refresh employees list to show updated profile pic to everyone
      const allEmployees = await employeeAPI.getAll();
      setEmployees(allEmployees.map(emp => ({
        ...emp,
        id: emp._id,
        profilePic: emp.profilePic || '👨‍💼'
      })));
      
      setShowAvatarModal(false);
      setSelectedAvatar('');
      setUploadedImage(null);
      setSelectedEmployeeForPicChange(null);
      
      const targetName = targetUser.id === currentUser.id ? 'your' : `${targetUser.name}'s`;
      showNotification('Success', `Profile picture updated and visible to everyone`);
    } catch (error) {
      showNotification('Error', 'Failed to update profile picture');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

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
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
      const employeeData = {
        ...newEmployee,
        color: colors[Math.floor(Math.random() * colors.length)],
        profilePic: presetAvatars[Math.floor(Math.random() * presetAvatars.length)]
      };
      
      const response = await authAPI.register(employeeData);
      setEmployees(prev => [...prev, { ...response.employee, id: response.employee._id }]);
      setNewEmployee({ name: '', email: '', password: '', role: 'employee', department: '' });
      setShowAddEmployee(false);
      showNotification('Success', `Employee ${response.employee.name} added successfully`);
    } catch (error) {
      showNotification('Error', error.response?.data?.error || 'Failed to add employee');
    }
  };

  const handleChangeEmployeeProfilePic = (employee) => {
    setSelectedEmployeeForPicChange(employee);
    setShowAvatarModal(true);
  };

  const handleEditEmployeeClick = (employee) => {
    setEditEmployee(employee);
    setShowEditEmployee(true);
  };

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
        emp.id === editEmployee.id ? { ...response.employee, id: response.employee._id || response.employee.id } : emp
      ));
      if (currentUser.id === editEmployee.id) {
        setCurrentUser({ ...response.employee, id: response.employee._id || response.employee.id });
      }
      setShowEditEmployee(false);
      setEditEmployee(null);
      showNotification('Success', `Employee ${response.employee.name} updated successfully`);
    } catch (error) {
      showNotification('Error', error.response?.data?.error || 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employeeId === currentUser.id) { showNotification('Error', 'You cannot delete yourself'); return; }
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        await employeeAPI.delete(employeeId);
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        setMessages(prev => prev.filter(msg => msg.senderId !== employeeId && msg.receiverId !== employeeId));
        setAttendanceRecords(prev => prev.filter(r => r.employeeId !== employeeId));
        setLeaveRequests(prev => prev.filter(l => l.employeeId !== employeeId));
        if (selectedContact?.id === employeeId) setSelectedContact(null);
        showNotification('Success', `Employee ${employee.name} deleted successfully`);
      } catch (error) {
        showNotification('Error', 'Failed to delete employee');
      }
    }
  };

  const getTotalEmployees = () => employees.length;
  const getActiveNow = () => attendanceRecords.filter(r => r.status === 'In Progress').length;
  const getCompletedToday = () => { const today = new Date().toLocaleDateString(); return attendanceRecords.filter(r => r.date === today && r.status === 'Completed').length; };
  const getPendingLeaves = () => leaveRequests.filter(l => l.status === 'pending').length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            {companyLogo ? (
              <div className="inline-block mb-4">
                <img src={companyLogo} alt="Company Logo" className="w-24 h-24 object-contain rounded-lg" />
              </div>
            ) : (
              <div className="inline-block p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
                <Users className="w-12 h-12 text-white" />
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-800">{systemSettings?.companyName || 'HR Management'}</h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{loginError}</span>
              </div>
            )}
            <button type="submit" disabled={loading || (lockoutTime && Date.now() < lockoutTime)} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Signing In...' : lockoutTime && Date.now() < lockoutTime ? `Locked (${Math.ceil((lockoutTime - Date.now()) / 1000)}s)` : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Force Password Change Modal
  if (currentUser && showForcePasswordChange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Password Reset Required</h1>
            <p className="text-gray-600 mt-2">You must change your password before continuing</p>
          </div>
          <form onSubmit={handleForcePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={forcePasswordForm.current}
                onChange={(e) => setForcePasswordForm({ ...forcePasswordForm, current: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={forcePasswordForm.new}
                onChange={(e) => setForcePasswordForm({ ...forcePasswordForm, new: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={forcePasswordForm.confirm}
                onChange={(e) => setForcePasswordForm({ ...forcePasswordForm, confirm: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Confirm new password"
                required
              />
            </div>
            {forcePasswordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{forcePasswordError}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Change Password
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            This is a one-time password change for security purposes.
          </p>
        </div>
      </div>
    );
  }

  if (currentUser.role === 'hr' && !hrClockedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 w-full max-w-md text-center relative z-10 border border-white/20">
          <div className="inline-block p-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mb-6 shadow-lg animate-pulse">
            <Clock className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Welcome, {currentUser.name}!</h1>
          <p className="text-gray-600 mb-8 text-lg">Please clock in to access the HR portal</p>
          <button onClick={handleHRClockIn} className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
            ⏰ Clock In Now
          </button>
          <button onClick={handleLogout} className="mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium">Logout</button>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => {
            setActiveSection('admin'); // Changed from 'employees' to 'admin' to match the section name
            // Reset any filters that might be applied
            setSearchEmployee('');
            setSelectedDepartment('all');
          }}
          className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all hover:shadow-2xl cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Employees</p>
              <p className="text-4xl font-bold mt-2">{getTotalEmployees()}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
          {currentUser.role === 'admin' && <p className="text-blue-100 text-xs mt-2">Click to view all employees</p>}
        </button>
        <button 
          onClick={() => {
            setAttendanceFilter('active');
            setActiveSection('attendance');
          }}
          className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all hover:shadow-2xl cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Active Now</p>
              <p className="text-4xl font-bold mt-2">{getActiveNow()}</p>
            </div>
            <Clock className="w-12 h-12 text-emerald-200" />
          </div>
          <p className="text-emerald-100 text-xs mt-2">Click to view active employees</p>
        </button>
        <button 
          onClick={() => {
            setAttendanceFilter('completed');
            setActiveSection('attendance');
          }}
          className="bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all hover:shadow-2xl cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Completed Today</p>
              <p className="text-4xl font-bold mt-2">{getCompletedToday()}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-violet-200" />
          </div>
          <p className="text-violet-100 text-xs mt-2">Click to view completed work</p>
        </button>
        <button 
          onClick={() => {
            setLeaveFilter('pending');
            setActiveSection('leave');
          }}
          className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all hover:shadow-2xl cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pending Leaves</p>
              <p className="text-4xl font-bold mt-2">{getPendingLeaves()}</p>
            </div>
            <Calendar className="w-12 h-12 text-orange-200" />
          </div>
          <p className="text-orange-100 text-xs mt-2">Click to view pending leaves</p>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Attendance</h3>
        {currentAttendance ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Current Session</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <p className="text-green-600 text-sm font-medium">Start Time</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{currentAttendance.startTime}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <p className="text-blue-600 text-sm font-medium">Status</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">In Progress</p>
              </div>
            </div>
            <button onClick={handleCompleteWork} className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
              Complete Work
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">You haven't started work today</p>
            <button onClick={handleStartWork} className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
              Start Work
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAttendance = () => {
    let displayRecords = currentUser.role === 'employee' ? attendanceRecords.filter(r => r.employeeId === currentUser.id) : attendanceRecords;
    const todayNotifications = hrClockInNotifications.filter(n => n.clockInDate === new Date().toLocaleDateString());
    const todayWorkCompletions = workCompletionNotifications.filter(n => n.date === new Date().toLocaleDateString());
    
    // Apply employee search filter first (only for non-employee users)
    if (currentUser.role !== 'employee' && attendanceEmployeeSearch.trim()) {
      displayRecords = displayRecords.filter(r => 
        r.employeeName && r.employeeName.toLowerCase().includes(attendanceEmployeeSearch.toLowerCase())
      );
    }
    
    // Apply filter
    const today = new Date().toLocaleDateString();
    if (attendanceFilter === 'active') {
      displayRecords = displayRecords.filter(r => r.date === today && r.status === 'In Progress');
    } else if (attendanceFilter === 'completed') {
      displayRecords = displayRecords.filter(r => r.date === today && r.status === 'Completed');
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Attendance Management</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setAttendanceFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                attendanceFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAttendanceFilter('active')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                attendanceFilter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Active ({getActiveNow()})
            </button>
            <button
              onClick={() => setAttendanceFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                attendanceFilter === 'completed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed ({getCompletedToday()})
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setShowDeleteHistoryConfirm(true)}
                className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-2"
                title="Delete all attendance history"
              >
                <Trash2 className="w-4 h-4" />
                Delete History
              </button>
            )}
          </div>
        </div>
        
        {/* Employee Search Section */}
        {currentUser.role !== 'employee' && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee by Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={attendanceEmployeeSearch}
                    onChange={(e) => setAttendanceEmployeeSearch(e.target.value)}
                    placeholder="Enter employee name to view their complete attendance history..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setAttendanceEmployeeSearch('')}
                  className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Clear Search
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Work Completion Notifications for Admin */}
        {currentUser.role === 'admin' && todayWorkCompletions.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 rounded-full p-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">✅ Work Completion Reports</h3>
                <div className="space-y-3">
                  {todayWorkCompletions.map(notif => (
                    <div key={notif.id} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{notif.employeeName}</p>
                          <p className="text-sm text-gray-500">{notif.time} • {notif.totalHours}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Work Summary:</p>
                        <p className="text-sm text-gray-600">{notif.workSummary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'admin' && todayNotifications.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 rounded-full p-2">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">🕐 HR Clock-In Notifications</h3>
                <div className="space-y-2">
                  {todayNotifications.map(notification => (
                    <div key={notification.id} className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {notification.hrName} <span className="text-blue-600">(HR)</span> clocked in
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        ⏰ Time: {notification.clockInTime} | 📅 Date: {notification.clockInDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Attendance History</h3>
            {attendanceEmployeeSearch.trim() && currentUser.role !== 'employee' && (
              <div className="text-sm text-gray-600">
                Found {displayRecords.length} record{displayRecords.length !== 1 ? 's' : ''} for "{attendanceEmployeeSearch}"
              </div>
            )}
          </div>
          {displayRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {attendanceEmployeeSearch.trim() && currentUser.role !== 'employee'
                ? `No attendance records found for "${attendanceEmployeeSearch}". Try a different name or clear the search.`
                : 'No attendance records found'
              }
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {currentUser.role !== 'employee' && <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>}
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Start Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">End Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Hours</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    {currentUser.role === 'admin' && <th className="text-left py-3 px-4 font-semibold text-gray-700">Work Summary</th>}
                    {currentUser.role === 'admin' && <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {displayRecords.sort((a, b) => b.id - a.id).map(record => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {currentUser.role !== 'employee' && <td className="py-3 px-4">{record.employeeName}</td>}
                      <td className="py-3 px-4">{record.date}</td>
                      <td className="py-3 px-4">{record.startTime}</td>
                      <td className="py-3 px-4">{record.endTime || '-'}</td>
                      <td className="py-3 px-4 font-semibold">{record.totalHours || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {record.status}
                        </span>
                      </td>
                      {currentUser.role === 'admin' && (
                        <td className="py-3 px-4">
                          {record.workSummary ? (
                            <button
                              onClick={() => handleViewWorkSummary(record)}
                              className="max-w-xs text-left hover:bg-blue-50 rounded px-2 py-1 transition-colors"
                            >
                              <p className="text-sm text-blue-600 hover:text-blue-800 truncate font-medium cursor-pointer" title="Click to view full summary">
                                {record.workSummary}
                              </p>
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      )}
                      {currentUser.role === 'admin' && (
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                setRecordToDelete(record);
                                setShowDeleteRecordConfirm(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md"
                              title="Delete this record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLeave = () => {
    const canApply = currentUser.role === 'employee' || currentUser.role === 'hr';
    
    // Dynamic approval logic based on leave requester's role
    const canApproveLeave = (leave) => {
      const leaveRequester = employees.find(emp => emp.id === leave.employeeId);
      if (!leaveRequester) return false;
      
      // If leave requester is an employee, both admin and HR can approve
      if (leaveRequester.role === 'employee') {
        return currentUser.role === 'admin' || currentUser.role === 'hr';
      }
      
      // If leave requester is HR, only admin can approve
      if (leaveRequester.role === 'hr') {
        return currentUser.role === 'admin';
      }
      
      return false;
    };
    
    const canApprove = leaveRequests.some(leave => canApproveLeave(leave));
    
    const myLeaves = leaveRequests.filter(l => l.employeeId === currentUser.id);
    let pendingLeaves = leaveRequests.filter(l => l.status === 'pending');
    
    // Apply filter for display
    let displayLeaves = canApprove ? leaveRequests : myLeaves;
    if (leaveFilter !== 'all') {
      displayLeaves = displayLeaves.filter(l => l.status === leaveFilter);
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Leave Management</h2>
          {canApprove && (
            <div className="flex gap-2">
              <button
                onClick={() => setLeaveFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  leaveFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setLeaveFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  leaveFilter === 'pending'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending ({pendingLeaves.length})
              </button>
              <button
                onClick={() => setLeaveFilter('approved')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  leaveFilter === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setLeaveFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  leaveFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Rejected
              </button>
            </div>
          )}
        </div>
        {canApply && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Apply for Leave</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                  <select value={leaveForm.type} onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                    <option value="vacation">Vacation</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" rows="3" placeholder="Enter reason for leave..." required />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                Submit Leave Request
              </button>
            </form>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Leave Requests</h3>
          {myLeaves.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No leave requests found</p>
          ) : (
            <div className="space-y-4">
              {myLeaves.sort((a, b) => b.id - a.id).map(leave => (
                <div key={leave.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">{leave.type}</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : leave.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {leave.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{leave.appliedDate}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><strong>Duration:</strong> {leave.startDate} to {leave.endDate}</p>
                  <p className="text-sm text-gray-600"><strong>Reason:</strong> {leave.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {canApprove && displayLeaves.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {leaveFilter === 'pending' ? 'Pending Approvals' : 
               leaveFilter === 'approved' ? 'Approved Leaves' :
               leaveFilter === 'rejected' ? 'Rejected Leaves' : 'All Leave Requests'}
            </h3>
            <div className="space-y-4">
              {displayLeaves.sort((a, b) => b.id - a.id).map(leave => (
                <div key={leave.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{leave.employeeName}</p>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">{leave.type}</span>
                    </div>
                    <p className="text-sm text-gray-500">{leave.appliedDate}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><strong>Duration:</strong> {leave.startDate} to {leave.endDate}</p>
                  <p className="text-sm text-gray-600 mb-4"><strong>Reason:</strong> {leave.reason}</p>
                  {canApproveLeave(leave) && (
                    <div className="flex gap-2">
                      <button onClick={() => handleLeaveAction(leave.id, 'approved')} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-all">
                        Approve
                      </button>
                      <button onClick={() => handleLeaveAction(leave.id, 'rejected')} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all">
                        Reject
                      </button>
                    </div>
                  )}
                  {!canApproveLeave(leave) && leave.status === 'pending' && (
                    <div className="text-center py-2 text-gray-500 text-sm">
                      Pending approval from authorized personnel
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderChat = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Messages</h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
        <div className="grid grid-cols-3 h-full">
          <div className="col-span-1 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={searchContact} onChange={(e) => setSearchContact(e.target.value)} placeholder="Search contacts..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.map(contact => {
                const lastMsg = getLastMessage(contact.id);
                const unread = getUnreadCount(contact.id);
                return (
                  <div key={contact.id} onClick={() => setSelectedContact(contact)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all ${selectedContact?.id === contact.id ? 'bg-indigo-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center text-2xl`}>
                        {typeof contact.profilePic === 'string' && contact.profilePic.startsWith('data:') ? (
                          <img src={contact.profilePic} alt={contact.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span>{contact.profilePic}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-gray-800 truncate">{contact.name}</p>
                          {unread > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unread}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{contact.department}</p>
                        {lastMsg && (
                          <p className="text-xs text-gray-400 truncate">{lastMsg.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-500">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${selectedContact.color} rounded-full flex items-center justify-center text-xl`}>
                      {typeof selectedContact.profilePic === 'string' && selectedContact.profilePic.startsWith('data:') ? (
                        <img src={selectedContact.profilePic} alt={selectedContact.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span>{selectedContact.profilePic}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{selectedContact.name}</p>
                      <p className="text-sm text-indigo-100">{selectedContact.department}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {getContactMessages(selectedContact.id).map(msg => (
                    <div key={msg.id} className={`mb-4 flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUser.id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                        <p className="text-sm">{msg.message}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${msg.senderId === currentUser.id ? 'text-indigo-100' : 'text-gray-400'}`}>
                          <p className="text-xs">{msg.timestamp}</p>
                          {msg.senderId === currentUser.id && (
                            <span className="flex items-center">
                              {msg.read ? (
                                // Bright cyan/aqua double checkmarks (read) - highly visible
                                <svg className="w-4 h-4 text-cyan-300" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L11 5l1 1-5.5 5.5z"/>
                                  <path d="M9.5 11.5L6 8l1-1 2.5 2.5L14 5l1 1-5.5 5.5z"/>
                                </svg>
                              ) : msg.delivered ? (
                                // Gray double checkmarks (delivered)
                                <svg className="w-4 h-4 opacity-60" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L11 5l1 1-5.5 5.5z"/>
                                  <path d="M9.5 11.5L6 8l1-1 2.5 2.5L14 5l1 1-5.5 5.5z"/>
                                </svg>
                              ) : (
                                // Single checkmark (sent)
                                <svg className="w-4 h-4 opacity-60" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M6.5 11.5L3 8l1-1 2.5 2.5L11 5l1 1-5.5 5.5z"/>
                                </svg>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)} />
                    <button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-lg hover:shadow-lg transition-all">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
          <button onClick={() => setSettingsTab('profile')} className={`pb-3 px-4 font-semibold whitespace-nowrap ${settingsTab === 'profile' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Profile</button>
          <button onClick={() => setSettingsTab('security')} className={`pb-3 px-4 font-semibold whitespace-nowrap ${settingsTab === 'security' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Security</button>
          <button onClick={() => setSettingsTab('notifications')} className={`pb-3 px-4 font-semibold whitespace-nowrap ${settingsTab === 'notifications' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Notifications</button>
          {currentUser.role === 'admin' && (
            <>
              <button onClick={() => setSettingsTab('branding')} className={`pb-3 px-4 font-semibold whitespace-nowrap ${settingsTab === 'branding' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4" />Branding</span>
              </button>
              <button onClick={() => setSettingsTab('emails')} className={`pb-3 px-4 font-semibold whitespace-nowrap ${settingsTab === 'emails' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" />Email Templates</span>
              </button>
            </>
          )}
        </div>
        {settingsTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={`w-24 h-24 ${currentUser.color} rounded-full flex items-center justify-center text-4xl`}>
                  {typeof currentUser.profilePic === 'string' && currentUser.profilePic.startsWith('data:') ? (
                    <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{currentUser.profilePic}</span>
                  )}
                </div>
                <button onClick={() => setShowAvatarModal(true)} className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{currentUser.name}</h3>
                <p className="text-gray-600">{currentUser.email}</p>
                <p className="text-sm text-gray-500">{currentUser.department}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : currentUser.role === 'hr' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Update Date of Birth</h3>
              <form onSubmit={handleDOBSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth || currentUser.dateOfBirth || ''}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                {dobError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <span className="text-sm">{dobError}</span>
                  </div>
                )}
                <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                  Update DOB
                </button>
              </form>
            </div>
          </div>
        )}
        {settingsTab === 'security' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                Update Password
              </button>
            </form>
          </div>
        )}
        {settingsTab === 'branding' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-600" />
                Company Branding
              </h3>
              
              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Company Logo</label>
                <div className="flex items-center gap-6">
                  {companyLogo ? (
                    <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center p-2">
                      <img src={companyLogo} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">No Logo</p>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                    {companyLogo && (
                      <button
                        onClick={handleRemoveLogo}
                        className="block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                        disabled={uploadingLogo}
                      >
                        Remove Logo
                      </button>
                    )}
                    <p className="text-xs text-gray-500">Recommended: Square image, max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={systemSettings?.companyName || ''}
                  onChange={(e) => handleSystemSettingsUpdate({ companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter company name"
                />
                <p className="text-xs text-gray-500 mt-1">This will appear in the navbar and login page</p>
              </div>
            </div>
          </div>
        )}
        {settingsTab === 'emails' && currentUser.role === 'admin' && systemSettings && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Professional Email Templates</h3>
                  <p className="text-sm text-gray-600">
                    Customize email templates for various HR activities. Use placeholders like <code className="bg-white px-1 rounded">{'{{employeeName}}'}</code>, <code className="bg-white px-1 rounded">{'{{companyName}}'}</code>, etc.
                  </p>
                </div>
              </div>
            </div>

            {/* Email Templates */}
            {[
              { key: 'welcomeEmail', title: 'Welcome Email', icon: '👋', desc: 'Sent to new employees on boarding' },
              { key: 'leaveRequest', title: 'Leave Request Notification', icon: '📨', desc: 'Sent to admin when employee requests leave' },
              { key: 'leaveApproval', title: 'Leave Approval Email', icon: '✅', desc: 'Sent when leave is approved' },
              { key: 'leaveRejection', title: 'Leave Rejection Email', icon: '❌', desc: 'Sent when leave is rejected' },
              { key: 'passwordReset', title: 'Password Reset Email', icon: '🔐', desc: 'Sent when password is reset' },
              { key: 'salarySlip', title: 'Salary Slip Notification', icon: '💰', desc: 'Sent with monthly salary slip' },
              { key: 'performanceReview', title: 'Performance Review Reminder', icon: '📊', desc: 'Sent before performance review' },
              { key: 'exitAcceptance', title: 'Exit/Resignation Acceptance', icon: '👋', desc: 'Sent when resignation is accepted' }
            ].map((template, idx) => (
              <div key={template.key} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{template.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800">{template.title}</h4>
                    <p className="text-sm text-gray-500">{template.desc}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Line</label>
                    <input
                      type="text"
                      value={systemSettings.emailTemplates?.[template.key]?.subject || ''}
                      onChange={(e) => {
                        const newTemplates = {
                          ...systemSettings.emailTemplates,
                          [template.key]: {
                            ...systemSettings.emailTemplates[template.key],
                            subject: e.target.value
                          }
                        };
                        handleSystemSettingsUpdate({ emailTemplates: newTemplates });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Email subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Body</label>
                    <textarea
                      value={systemSettings.emailTemplates?.[template.key]?.body || ''}
                      onChange={(e) => {
                        const newTemplates = {
                          ...systemSettings.emailTemplates,
                          [template.key]: {
                            ...systemSettings.emailTemplates[template.key],
                            body: e.target.value
                          }
                        };
                        handleSystemSettingsUpdate({ emailTemplates: newTemplates });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                      rows="8"
                      placeholder="Email content with placeholders..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => {
    const todayWorkCompletions = workCompletionNotifications.filter(n => n.date === new Date().toLocaleDateString());
    
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
        
        {/* Birthday Notifications */}
        {birthdayEmployees.length > 0 && (
          <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 border-l-4 border-pink-500 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-pink-500 rounded-full p-3">
                <span className="text-3xl">🎂</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  🎉 Birthday Celebrations Today!
                </h3>
                <div className="space-y-3">
                  {birthdayEmployees.map(emp => (
                    <div key={emp.id} className="bg-white rounded-lg p-4 border-2 border-pink-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{emp.profilePic || '👨‍💼'}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800">{emp.name}</h4>
                          <p className="text-sm text-gray-600">{emp.department} • {emp.role}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                            🎂 Birthday!
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 bg-pink-50 rounded-lg p-3">
                        <p className="text-sm text-pink-800 font-medium">
                          🎈 Wish {emp.name} a happy birthday! Send them a message to celebrate their special day! 🎉
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Work Completion Notifications for Admin */}
        {currentUser.role === 'admin' && todayWorkCompletions.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 rounded-full p-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">✅ Work Completion Reports</h3>
                <div className="space-y-3">
                  {todayWorkCompletions.map(notif => (
                    <div key={notif.id} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{notif.employeeName}</p>
                          <p className="text-sm text-gray-500">{notif.time} • {notif.totalHours}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Work Summary:</p>
                        <p className="text-sm text-gray-600">{notif.workSummary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Notifications */}
        {birthdayEmployees.length === 0 && todayWorkCompletions.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Notifications</h3>
            <p className="text-gray-600">You're all caught up! No new notifications at the moment.</p>
          </div>
        )}
      </div>
    );
  };

  const renderAdmin = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Employee Management</h2>
        <button onClick={() => setShowAddEmployee(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add Employee
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Employees</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${emp.color} rounded-full flex items-center justify-center text-xl`}>
                        {typeof emp.profilePic === 'string' && emp.profilePic.startsWith('data:') ? (
                          <img src={emp.profilePic} alt={emp.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span>{emp.profilePic}</span>
                        )}
                      </div>
                      <span className="font-semibold">{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{emp.email}</td>
                  <td className="py-3 px-4">{emp.department}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.role === 'admin' ? 'bg-purple-100 text-purple-700' : emp.role === 'hr' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {emp.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEditEmployeeClick(emp)} className="text-blue-500 hover:text-blue-700 transition-all" title="Edit">
                        <Settings className="w-5 h-5" />
                      </button>
                      {currentUser.role === 'admin' && emp.id !== currentUser.id && (
                        <button onClick={() => handleChangeEmployeeProfilePic(emp)} className="text-purple-500 hover:text-purple-700 transition-all" title="Change Profile Picture">
                          <Camera className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-500 hover:text-red-700 transition-all" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <div key={notif.id} className="bg-white rounded-lg shadow-lg p-4 w-80 border-l-4 border-indigo-500 animate-slide-in">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-indigo-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{notif.title}</p>
                <p className="text-sm text-gray-600">{notif.body}</p>
              </div>
              <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen fixed left-0 top-0 border-r border-slate-700 shadow-2xl">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8 p-3 bg-gradient-to-r from-pink-500 to-fuchsia-700 rounded-xl shadow-lg">
              {companyLogo ? (
                <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center">
                  <img src={companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              )}
              <h1 className="text-xl font-bold text-white">{systemSettings?.companyName || 'HR Portal'}</h1>
            </div>
            <nav className="space-y-2">
              <button onClick={() => setActiveSection('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'dashboard' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105' : 'text-gray-300 hover:bg-slate-800/50'}`}>
                <Users className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button onClick={() => setActiveSection('attendance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'attendance' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105' : 'text-gray-300 hover:bg-slate-800/50'}`}>
                <Clock className="w-5 h-5" />
                <span className="font-medium">Attendance</span>
                {currentUser.role === 'admin' && hrClockInNotifications.filter(n => n.clockInDate === new Date().toLocaleDateString() && !viewedHrNotifications.includes(n.id)).length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {hrClockInNotifications.filter(n => n.clockInDate === new Date().toLocaleDateString() && !viewedHrNotifications.includes(n.id)).length}
                  </span>
                )}
              </button>
              <button onClick={() => setActiveSection('leave')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'leave' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-105' : 'text-gray-300 hover:bg-slate-800/50'}`}>
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Leave</span>
              </button>
              <button onClick={() => setActiveSection('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'chat' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg scale-105' : 'text-gray-300 hover:bg-slate-800/50'}`}>
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Messages</span>
                {messages.filter(m => m.receiverId === currentUser.id && !m.read).length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {messages.filter(m => m.receiverId === currentUser.id && !m.read).length}
                  </span>
                )}
              </button>
              <button onClick={() => setActiveSection('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'notifications' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg scale-105' : 'text-gray-300 hover:bg-slate-800/50'}`}>
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notifications</span>
                {(() => {
                  const unviewedBirthdays = birthdayEmployees.filter(emp => !viewedNotifications.birthdays.includes(emp.id)).length;
                  const unviewedWorkReports = currentUser.role === 'admin' 
                    ? workCompletionNotifications.filter(n => n.date === new Date().toLocaleDateString() && !viewedNotifications.workReports.includes(n.id)).length 
                    : 0;
                  const totalUnviewed = unviewedBirthdays + unviewedWorkReports;
                  return totalUnviewed > 0 && (
                    <span className="ml-auto bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {totalUnviewed}
                    </span>
                  );
                })()}
              </button>
              {(currentUser.role === 'admin' || currentUser.role === 'hr') && (
                <button 
                  onClick={() => setActiveSection('admin')} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'admin' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg scale-105' : 'text-gray-300 hover:bg-slate-800/50'}`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="font-medium">Manage Users</span>
                </button>
              )}
              <button onClick={() => setActiveSection('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === 'settings' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg scale-105' : 'text-gray-300 hover:bg-slate-800/50'}`}>
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              {currentUser.role === 'hr' && hrClockedIn && (
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clock out? You will need to clock in again to access the portal.')) {
                      setHrClockedIn(false);
                      showNotification('Clocked Out', 'You have successfully clocked out. See you next time!');
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-all border border-orange-500/20"
                >
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Clock Out</span>
                </button>
              )}
              <button 
                onClick={handleLogout} 
                disabled={currentUser.role === 'hr' && hrClockedIn}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border ${
                  currentUser.role === 'hr' && hrClockedIn
                    ? 'bg-gray-500/10 text-gray-400 cursor-not-allowed border-gray-500/20 opacity-50'
                    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20'
                }`}
                title={currentUser.role === 'hr' && hrClockedIn ? 'Please clock out before logging out' : 'Logout'}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
                {currentUser.role === 'hr' && hrClockedIn && (
                  <span className="ml-auto text-xs">⚠️</span>
                )}
              </button>
            </nav>
          </div>
        </div>
        <div className="ml-64 flex-1 flex flex-col min-h-screen">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg border-b border-slate-700 px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
                {currentUser && currentUser.dateOfBirth && (() => {
                  const today = new Date();
                  const userDOB = new Date(currentUser.dateOfBirth);
                  const isBirthday = today.getMonth() === userDOB.getMonth() && today.getDate() === userDOB.getDate();
                  return isBirthday && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-full animate-pulse">
                      <span className="text-2xl">🎂</span>
                      <span className="text-white font-bold">Happy Birthday, {currentUser.name}!</span>
                      <span className="text-2xl">🎉</span>
                    </div>
                  );
                })()}
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${currentUser.color} rounded-full flex items-center justify-center text-xl ring-2 ring-white/20`}>
                  {typeof currentUser.profilePic === 'string' && currentUser.profilePic.startsWith('data:') ? (
                    <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{currentUser.profilePic}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white">{currentUser.name}</p>
                  <p className="text-sm text-slate-300 capitalize">{currentUser.role}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-slate-100">
            {activeSection === 'dashboard' && renderDashboard()}
            {activeSection === 'attendance' && renderAttendance()}
            {activeSection === 'leave' && renderLeave()}
            {activeSection === 'chat' && renderChat()}
            {activeSection === 'notifications' && renderNotifications()}
            {activeSection === 'settings' && renderSettings()}
            {(activeSection === 'admin' && (currentUser.role === 'admin' || currentUser.role === 'hr')) && renderAdmin()}
          </div>
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-3 px-8 border-t border-slate-700">
            <div className="flex justify-center items-center">
              <p className="text-xs text-slate-300 font-semibold">Made with ❤️ by Harsha Patil</p>
            </div>
          </div>
        </div>
      </div>
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Change Profile Picture {selectedEmployeeForPicChange ? `for ${selectedEmployeeForPicChange.name}` : ''}
            </h3>
            <div className="flex gap-4 border-b-2 border-gray-200 mb-6">
              <button onClick={() => setAvatarTab('preset')} className={`pb-3 px-4 font-semibold transition-all ${avatarTab === 'preset' ? 'border-b-2 border-violet-500 text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}>🎭 Preset Avatars</button>
              <button onClick={() => setAvatarTab('upload')} className={`pb-3 px-4 font-semibold transition-all ${avatarTab === 'upload' ? 'border-b-2 border-violet-500 text-violet-600' : 'text-gray-500 hover:text-gray-700'}`}>📸 Upload Image</button>
            </div>
            {avatarTab === 'preset' && (
              <div className="grid grid-cols-5 gap-4 mb-6">
                {presetAvatars.map((avatar, idx) => (
                  <button key={idx} onClick={() => setSelectedAvatar(avatar)} className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl hover:scale-110 transition-all ${selectedAvatar === avatar ? 'ring-4 ring-violet-500 bg-violet-50' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    {avatar}
                  </button>
                ))}
              </div>
            )}
            {avatarTab === 'upload' && (
              <div className="mb-6">
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-50/50 transition-all">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-violet-500" />
                  <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {uploadedImage && (
                  <div className="mt-4 text-center">
                    <img src={uploadedImage} alt="Preview" className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-violet-500" />
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-4">
              <button onClick={() => { setShowAvatarModal(false); setSelectedAvatar(''); setUploadedImage(null); }} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                Cancel
              </button>
              <button onClick={handleAvatarSave} className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all">
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">👤 Add New Employee</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" placeholder="john@company.com" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input type="password" value={newEmployee.password} onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" placeholder="Min 6 characters" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <input type="text" value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all" placeholder="Engineering" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all">
                  <option value="employee">👨‍💻 Employee</option>
                  <option value="hr">👩‍💼 HR</option>
                  <option value="admin">👨‍💼 Admin</option>
                </select>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => { setShowAddEmployee(false); setNewEmployee({ name: '', email: '', password: '', role: 'employee', department: '' }); }} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all">
                  ✅ Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditEmployee && editEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">✏️ Edit Employee</h3>
            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" value={editEmployee.name} onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input type="email" value={editEmployee.email} onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="john@company.com" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password (leave blank to keep current)</label>
                <input type="password" value={editEmployee.password || ''} onChange={(e) => setEditEmployee({ ...editEmployee, password: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="New password (optional)" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <input type="text" value={editEmployee.department} onChange={(e) => setEditEmployee({ ...editEmployee, department: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="Engineering" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select value={editEmployee.role} onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                  <option value="employee">👨‍💻 Employee</option>
                  <option value="hr">👩‍💼 HR</option>
                  <option value="admin">👨‍💼 Admin</option>
                </select>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => { setShowEditEmployee(false); setEditEmployee(null); }} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all">
                  💾 Update Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOB Modal */}
      {showDOBModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                🎂 Welcome to the Team!
              </h2>
              <p className="text-pink-100 mt-2">Please share your date of birth with us</p>
            </div>
            <form onSubmit={handleDOBSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll wish you on your special day! 🎉
                </p>
              </div>
              
              {dobError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{dobError}</span>
                </div>
              )}

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <p className="text-sm text-pink-800">
                  <strong>Note:</strong> Your date of birth helps us celebrate your special day and is kept confidential.
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Continue to Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Birthday Wish Banner */}
      {showBirthdayWish && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-white">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🎉</span>
              <div>
                <h3 className="text-2xl font-bold">Happy Birthday, {currentUser?.name}! 🎂</h3>
                <p className="text-sm">Wishing you an amazing day filled with joy!</p>
              </div>
              <span className="text-4xl">🎈</span>
            </div>
          </div>
        </div>
      )}

      {/* Birthday Sparkles/Confetti - Full Day - Dashboard Only */}
      {activeSection === 'dashboard' && currentUser && currentUser.dateOfBirth && (() => {
        const today = new Date();
        const userDOB = new Date(currentUser.dateOfBirth);
        const isBirthday = today.getMonth() === userDOB.getMonth() && today.getDate() === userDOB.getDate();
        return isBirthday;
      })() && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                fontSize: `${20 + Math.random() * 20}px`,
              }}
            >
              {['🎉', '🎊', '🎈', '🎂', '✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}

      {/* Work Summary Modal */}
      {showWorkSummaryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <CheckCircle className="w-8 h-8" />
                Complete Your Work
              </h2>
              <p className="text-blue-100 mt-2">Please provide a summary of what you accomplished today</p>
            </div>
            <form onSubmit={handleSubmitWorkSummary} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={workSummary}
                  onChange={(e) => setWorkSummary(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="6"
                  placeholder="Describe what you worked on today, tasks completed, achievements, challenges faced, etc. (minimum 10 characters)"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {workSummary.length} characters (minimum 10 required)
                </p>
              </div>
              
              {workSummaryError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{workSummaryError}</span>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your work summary will be sent to the admin for review. Please be detailed and professional.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowWorkSummaryModal(false);
                    setWorkSummary('');
                    setWorkSummaryError('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Submit & Complete Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work Summary Details Modal */}
      {showWorkSummaryDetailsModal && selectedAttendanceRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Work Summary Details</h2>
                  <p className="text-blue-100 mt-2">Complete work summary from employee</p>
                </div>
                <button
                  onClick={() => {
                    setShowWorkSummaryDetailsModal(false);
                    setSelectedAttendanceRecord(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Employee Name</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedAttendanceRecord.employeeName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedAttendanceRecord.date}</p>
                </div>
              </div>

              {/* Time Information */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-600 mb-1">Start Time</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedAttendanceRecord.startTime}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-600 mb-1">End Time</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedAttendanceRecord.endTime || '-'}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1">Total Hours</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedAttendanceRecord.totalHours || '-'}</p>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedAttendanceRecord.status === 'Completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedAttendanceRecord.status}
                </span>
              </div>

              {/* Work Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Work Summary
                </h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedAttendanceRecord.workSummary || 'No work summary provided'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    setShowWorkSummaryDetailsModal(false);
                    setSelectedAttendanceRecord(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete History Confirmation Modal */}
      {showDeleteHistoryConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Confirm Delete</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-gray-800 font-semibold mb-2">⚠️ Warning: This action cannot be undone!</p>
                <p className="text-gray-700">
                  You are about to delete <strong>all attendance history</strong> from the database. 
                  This will permanently remove all records including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>All employee attendance records</li>
                  <li>Work summaries and time logs</li>
                  <li>Historical data for reporting</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This will delete {attendanceRecords.length} attendance record{attendanceRecords.length !== 1 ? 's' : ''}.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteHistoryConfirm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAttendanceHistory}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete All History
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Record Confirmation Modal */}
      {showDeleteRecordConfirm && recordToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Delete Record</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-gray-800 font-semibold mb-2">⚠️ Are you sure you want to delete this record?</p>
                <p className="text-gray-700">
                  This will permanently delete the following attendance record:
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-semibold text-gray-800">{recordToDelete.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-800">{recordToDelete.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold text-gray-800">{recordToDelete.startTime} - {recordToDelete.endTime || 'In Progress'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-semibold text-gray-800">{recordToDelete.totalHours || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    recordToDelete.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {recordToDelete.status}
                  </span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>Note:</strong> This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDeleteRecordConfirm(false);
                    setRecordToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSingleRecord}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete Record
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRManagementSystem;
