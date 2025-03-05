export interface Shop {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ShopFormData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface ShopFilters {
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface PaginatedShops {
  data: Shop[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
} 