import { api, initializeCsrf } from '../lib/axios';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await initializeCsrf();
    const response = await api.post<AuthResponse>('/api/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await initializeCsrf();
    const response = await api.post<AuthResponse>('/api/register', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await initializeCsrf();
    await api.post('/api/logout');
    localStorage.removeItem('token');
  },

  async getUser(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/api/user');
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    await initializeCsrf();
    const response = await api.post<{ message: string }>('/api/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  }): Promise<{ message: string }> {
    await initializeCsrf();
    const response = await api.post<{ message: string }>('/api/reset-password', data);
    return response.data;
  },

  async updatePassword(data: { current_password: string; password: string; password_confirmation: string }) {
    await initializeCsrf();
    const response = await api.put('/api/user/password', data);
    return response.data;
  },
}; 