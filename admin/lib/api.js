const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
const cleanUrl = rawUrl.replace(/\/+$/, '');
export const API_BASE = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('smp_admin_token') || '';
  }
  return '';
}

export function getAuthHeaders(isJson = true) {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function authFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = options.headers ? { ...options.headers } : {};
  if (token && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      localStorage.removeItem('smp_admin_token');
      localStorage.removeItem('smp_admin_user');
      window.location.href = '/login?expired=1';
    }
  }
  return res;
}
