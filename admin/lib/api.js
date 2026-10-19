export const API_BASE = 'http://localhost:5000/api';

export function getAuthHeaders(isJson = true) {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('smp_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('smp_admin_token') || '';
  }
  return '';
}
