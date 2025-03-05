export interface User {
  id: number;
  name: string;
  email: string;
  kana?: string;
  birthday?: string;
  postal_code?: string;
  address?: string;
  phone?: string;
  avatar?: string;
  avatar_url?: string;
  bio?: string;
  notification_settings?: Record<string, boolean>;
  app_settings?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
} 