export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CategoryFilters {
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// 標準的なLaravelのページネーションレスポンス
export interface PaginatedCategories {
  data: Category[];
  meta?: {
    current_page?: number;
    from?: number;
    last_page?: number;
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
  // 代替形式のページネーション情報（APIによって異なる場合）
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number;
  to?: number;
} 