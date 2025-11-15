import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Add Authorization header automatically if token present
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
  getUserInfo: () => api.get('/auth/me'),
};

export const competitionsApi = {
  getAll: () => api.get('/competitions'),
  getOne: (id: string) => api.get(`/competitions/${id}`),
  create: (data: any) => api.post('/competitions', data),
  register: (id: string, idempotencyKey?: string) =>
    api.post(
      `/competitions/${id}/register`,
      {},
      {
        headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      }
    ),
  getRegistrations: (id: string) => api.get(`/competitions/${id}/registrations`),
  getMyRegistrations: () => api.get('/competitions/registrations/my'),
};


