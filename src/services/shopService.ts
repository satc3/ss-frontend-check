import api from './api';
import { Shop, ShopFormData, ShopFilters, PaginatedShops } from '../types/shop';

// 店舗一覧を取得
export const getShops = async (filters: ShopFilters = {}): Promise<PaginatedShops> => {
  try {
    const response = await api.get('/api/shops', { params: filters });
    return response.data;
  } catch (error) {
    console.error('店舗一覧の取得に失敗しました', error);
    throw error;
  }
};

// 店舗詳細を取得
export const getShop = async (id: number): Promise<Shop> => {
  try {
    const response = await api.get(`/api/shops/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`店舗ID:${id}の取得に失敗しました`, error);
    throw error;
  }
};

// 店舗を作成
export const createShop = async (data: ShopFormData): Promise<Shop> => {
  try {
    const response = await api.post('/api/shops', data);
    return response.data.data;
  } catch (error) {
    console.error('店舗の作成に失敗しました', error);
    throw error;
  }
};

// 店舗を更新
export const updateShop = async (id: number, data: ShopFormData): Promise<Shop> => {
  try {
    const response = await api.put(`/api/shops/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error(`店舗ID:${id}の更新に失敗しました`, error);
    throw error;
  }
};

// 店舗を削除
export const deleteShop = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/shops/${id}`);
  } catch (error) {
    console.error(`店舗ID:${id}の削除に失敗しました`, error);
    throw error;
  }
};

// 店舗を検索
export const searchShops = async (query: string): Promise<Shop[]> => {
  try {
    const response = await api.get('/api/shops/search', { params: { query } });
    return response.data.data;
  } catch (error) {
    console.error('店舗の検索に失敗しました', error);
    throw error;
  }
}; 