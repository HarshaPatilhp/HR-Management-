import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  register: async (employeeData) => {
    const response = await api.post('/auth/register', employeeData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  changePassword: async (userId, currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      userId,
      currentPassword,
      newPassword
    });
    return response.data;
  },
  
  updateDOB: async (userId, dateOfBirth) => {
    const response = await api.post('/auth/update-dob', {
      userId,
      dateOfBirth
    });
    return response.data;
  },
};

// Employee API
export const employeeAPI = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
  
  clockIn: async (id) => {
    const response = await api.put(`/employees/${id}/clock-in`);
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  getAll: async (employeeId = null) => {
    const params = employeeId ? { employeeId } : {};
    const response = await api.get('/attendance', { params });
    return response.data;
  },
  
  startWork: async (data) => {
    const response = await api.post('/attendance/start', data);
    return response.data;
  },
  
  completeWork: async (id, data) => {
    const response = await api.put(`/attendance/${id}/complete`, data);
    return response.data;
  },
};

// Leave API
export const leaveAPI = {
  getAll: async (employeeId = null, status = null) => {
    const params = {};
    if (employeeId) params.employeeId = employeeId;
    if (status) params.status = status;
    const response = await api.get('/leave', { params });
    return response.data;
  },
  
  submit: async (data) => {
    const response = await api.post('/leave', data);
    return response.data;
  },
  
  approve: async (id) => {
    const response = await api.put(`/leave/${id}/approve`);
    return response.data;
  },
  
  reject: async (id) => {
    const response = await api.put(`/leave/${id}/reject`);
    return response.data;
  },
};

// Message API
export const messageAPI = {
  getAll: async (userId) => {
    const response = await api.get('/messages', { params: { userId } });
    return response.data;
  },
  
  send: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await api.put(`/messages/${id}/read`);
    return response.data;
  },
};

export default api;
