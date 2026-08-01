import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry && !original.url?.includes('/auth/refresh')) {
      original._retry = true;
      const refreshToken = localStorage.getItem('sp_refresh_token');
      if (refreshToken) {
        try {
          const { data } = await api.post('/auth/refresh', { refreshToken });
          localStorage.setItem('sp_access_token', data.accessToken);
          localStorage.setItem('sp_refresh_token', data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          localStorage.removeItem('sp_access_token');
          localStorage.removeItem('sp_refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);
