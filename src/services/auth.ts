import { api, initializeCsrf } from 'lib/axios';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from 'types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('ログイン処理開始');
      await initializeCsrf();
      console.log('CSRFトークン初期化完了');
      
      const response = await api.post<AuthResponse>('/api/login', credentials);
      console.log('ログインAPI応答:', response);
      
      // トークンをローカルストレージに保存
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('トークンをローカルストレージに保存しました');
      }
      
      // クッキーが設定されているか確認
      const allCookies = document.cookie;
      console.log('現在のクッキー:', allCookies);
      
      return response.data;
    } catch (error) {
      console.error('ログイン中にエラーが発生しました:', error);
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      await initializeCsrf();
      const response = await api.post<AuthResponse>('/api/register', credentials);
      
      // トークンをローカルストレージに保存
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('登録中にエラーが発生しました:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await initializeCsrf();
      await api.post('/api/logout');
      // トークンを削除
      localStorage.removeItem('token');
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
      // エラーが発生しても、とりあえずローカルのトークンは削除しておく
      localStorage.removeItem('token');
      throw error;
    }
  },

  async getUser(): Promise<AuthResponse> {
    try {
      const response = await api.get<AuthResponse>('/api/user');
      // ユーザー情報をローカルストレージに保存
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました:', error);
      throw error;
    }
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