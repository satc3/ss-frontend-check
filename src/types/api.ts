export interface ApiError extends Error {
  response?: {
    data?: {
      errors?: Record<string, string[]>;
      message?: string;
    };
    status?: number;
  };
} 