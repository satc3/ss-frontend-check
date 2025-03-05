export interface Item {
  id: number;
  name: string;
  description?: string;
  category_id?: number;
  image_url?: string;
  barcode?: string;
  sku?: string;
  user_id?: number;
}

export interface ItemFormData {
  name: string;
  description?: string;
  category_id?: number;
  image_url?: string;
  barcode?: string;
  sku?: string;
}

export interface ItemFilters {
  search?: string;
  category_id?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// 標準的なLaravelのページネーションレスポンス
export interface PaginatedItems {
  data: Item[];
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