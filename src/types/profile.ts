export interface ProfileUpdateData {
  name?: string;
  kana?: string;
  birthday?: string;
  postal_code?: string;
  address?: string;
  phone?: string;
  bio?: string;
  notification_settings?: Record<string, boolean>;
  app_settings?: Record<string, string>;
}

export interface ProfileResponse {
  message: string;
  user: {
    id: number;
    name: string;
    kana?: string;
    email: string;
    birthday?: string;
    postal_code?: string;
    address?: string;
    phone?: string;
    avatar_url?: string;
    bio?: string;
    notification_settings?: Record<string, boolean>;
    app_settings?: Record<string, string>;
  };
} 