import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, AuthError } from '@/types/auth';
import { authService } from '@/services/auth';
import type { AxiosError } from 'axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ローカルストレージからトークンとユーザー情報を取得
const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('ログインアクション開始');
      const response = await authService.login(credentials);
      console.log('ログインアクション成功:', response);
      return response;
    } catch (error) {
      console.error('ログインアクション失敗:', error);
      const axiosError = error as AxiosError<AuthError>;
      return rejectWithValue(axiosError.response?.data || { message: 'ログインに失敗しました。' });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { name: string; email: string; password: string; password_confirmation: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<AuthError>;
      return rejectWithValue(axiosError.response?.data || { message: '登録に失敗しました。' });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      const axiosError = error as AxiosError<AuthError>;
      return rejectWithValue(axiosError.response?.data || { message: 'ログアウトに失敗しました。' });
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUser();
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<AuthError>;
      return rejectWithValue(axiosError.response?.data || { message: 'ユーザー情報の取得に失敗しました。' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token || null;
        console.log('Reduxストア更新 - ログイン成功:', { user: state.user, token: state.token });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('Reduxストア更新 - ログイン失敗:', action.payload);
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        if (action.payload.token) {
          state.token = action.payload.token;
        }
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 