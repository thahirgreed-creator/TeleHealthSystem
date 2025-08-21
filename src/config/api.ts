// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  REPORTS: {
    BASE: '/reports',
    PATIENT: (patientId: string) => `/reports/patient/${patientId}`,
  },
  CONSULTATIONS: {
    BASE: '/consultations',
  },
  LAB_RESULTS: {
    BASE: '/labresults',
  },
  ALERTS: {
    BASE: '/alerts',
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function for API requests with auth
export const createAuthHeaders = (token: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};