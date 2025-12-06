import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// QR Code APIs
export const generateQR = (data) => api.post('/qr/generate', data);
export const getAllQRCodes = (params) => api.get('/qr/all', { params });
export const getQRCode = (id) => api.get(`/qr/${id}`);
export const getQRByShortId = (shortId) => api.get(`/qr/short/${shortId}`);
export const updateQRCode = (id, data) => api.put(`/qr/${id}`, data);
export const deleteQRCode = (id) => api.delete(`/qr/${id}`);

// Analytics APIs
export const getDashboardStats = (params) => api.get('/analytics/dashboard', { params });
export const getQRAnalytics = (id, params) => api.get(`/analytics/qr/${id}`, { params });

// Scan APIs
export const getQRScans = (id, params) => api.get(`/scan/qr/${id}`, { params });

export default api;
