export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
}

export interface Shop {
  id: number;
  name: string;
  description?: string;
  address?: string;
}

export interface ReceiptItem {
  id: number;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  item_id?: number;
  category_id?: number;
}

export interface Receipt {
  id: number;
  total_amount: number;
  items: ReceiptItem[];
}

export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  expense_date: string;
  category?: Category;
  category_id?: number;
  payment_method?: PaymentMethod;
  payment_method_id?: number;
  shop?: Shop;
  shop_id?: number;
  item_id?: number;
  is_recurring: boolean;
  recurring_type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurring_day?: number;
  created_at: string;
  updated_at: string;
  items?: ExpenseItemData[];
  receipt?: Receipt;
  receipt_id?: number;
}

export interface ExpenseItemData {
  item_id?: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  category_id?: number;
}

export interface ExpenseFormData {
  title: string;
  description?: string;
  amount: number;
  expense_date: string;
  category_id?: number;
  payment_method_id?: number;
  shop_id?: number;
  item_id?: number;
  is_recurring: boolean;
  recurring_type?: string;
  recurring_day?: number;
  items?: ExpenseItemData[];
}

export interface ExpenseFilters {
  category_id?: number;
  payment_method_id?: number;
  shop_id?: number;
  date?: string; // 'YYYY-MM-DD' 形式
  year_month?: string; // 'YYYY-MM' 形式
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface PaginatedExpenses {
  data: Expense[];
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