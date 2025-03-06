import api from '@/lib/axios';
import { Expense, ExpenseFormData, ExpenseFilters, PaginatedExpenses, Category, PaymentMethod, Shop } from '@/types/expense';

// 支出一覧を取得
export const getExpenses = async (filters: ExpenseFilters = {}): Promise<PaginatedExpenses> => {
  try {
    const response = await api.get('/api/expenses', { params: filters });
    return response.data;
  } catch (error) {
    console.error('支出一覧の取得に失敗しました', error);
    throw error;
  }
};

// 支出詳細を取得
export const getExpense = async (id: number): Promise<Expense> => {
  try {
    const response = await api.get(`/api/expenses/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`支出ID:${id}の取得に失敗しました`, error);
    throw error;
  }
};

// 支出を作成
export const createExpense = async (data: ExpenseFormData): Promise<Expense> => {
  try {
    // デバッグ用：送信データをログ出力
    console.log('作成リクエストデータ:', JSON.stringify(data, null, 2));
    
    const response = await api.post('/api/expenses', data);
    console.log('作成レスポンス:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('支出の作成に失敗しました', error);
    throw error;
  }
};

// 支出を更新
export const updateExpense = async (id: number, data: ExpenseFormData): Promise<Expense> => {
  try {
    // デバッグ用：送信データをログ出力
    console.log('更新リクエストデータ:', JSON.stringify(data, null, 2));
    
    const response = await api.put(`/api/expenses/${id}`, data);
    console.log('更新レスポンス:', response.data);
    return response.data.data;
  } catch (error) {
    console.error(`支出ID:${id}の更新に失敗しました`, error);
    throw error;
  }
};

// 支出を削除
export const deleteExpense = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/expenses/${id}`);
  } catch (error) {
    console.error(`支出ID:${id}の削除に失敗しました`, error);
    throw error;
  }
};

// カテゴリー一覧を取得
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/api/categories');
    return response.data.data;
  } catch (error) {
    console.error('カテゴリー一覧の取得に失敗しました', error);
    throw error;
  }
};

// 支払い方法一覧を取得
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const response = await api.get('/api/payment-methods');
    return response.data.data;
  } catch (error) {
    console.error('支払い方法一覧の取得に失敗しました', error);
    throw error;
  }
};

// 店舗一覧を取得
export const getShops = async (): Promise<Shop[]> => {
  try {
    const response = await api.get('/api/shops');
    return response.data.data;
  } catch (error) {
    console.error('店舗一覧の取得に失敗しました', error);
    throw error;
  }
}; 