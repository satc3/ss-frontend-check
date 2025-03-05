import api from './api';
import { Category, CategoryFormData, CategoryFilters, PaginatedCategories } from '../types/category';

// カテゴリー一覧を取得
export const getCategories = async (filters: CategoryFilters = {}): Promise<PaginatedCategories> => {
  try {
    const response = await api.get('/api/categories', { params: filters });
    
    // APIレスポンスの形式を確認
    console.log('API Response:', response.data);
    
    // レスポンスがdata配列を直接含む場合の処理
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        current_page: 1,
        last_page: 1,
        per_page: response.data.length
      };
    }
    
    // 標準的なLaravelのページネーションレスポンス
    return response.data;
  } catch (error) {
    console.error('カテゴリー一覧の取得に失敗しました', error);
    // エラー時は空のデータを返す
    return {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    };
  }
};

// カテゴリー詳細を取得
export const getCategory = async (id: number): Promise<Category> => {
  try {
    const response = await api.get(`/api/categories/${id}`);
    
    // APIレスポンスの形式を確認
    console.log(`Category ${id} API Response:`, response.data);
    
    // レスポンスがdataプロパティを持つ場合
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // レスポンスが直接カテゴリーオブジェクトの場合
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('カテゴリーデータの形式が不正です');
  } catch (error) {
    console.error(`カテゴリーID:${id}の取得に失敗しました`, error);
    throw error;
  }
};

// カテゴリーを作成
export const createCategory = async (data: CategoryFormData): Promise<Category> => {
  try {
    const response = await api.post('/api/categories', data);
    
    // APIレスポンスの形式を確認
    console.log('Create Category API Response:', response.data);
    
    // レスポンスがdataプロパティを持つ場合
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // レスポンスが直接カテゴリーオブジェクトの場合
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('作成されたカテゴリーデータの形式が不正です');
  } catch (error) {
    console.error('カテゴリーの作成に失敗しました', error);
    throw error;
  }
};

// カテゴリーを更新
export const updateCategory = async (id: number, data: CategoryFormData): Promise<Category> => {
  try {
    const response = await api.put(`/api/categories/${id}`, data);
    
    // APIレスポンスの形式を確認
    console.log(`Update Category ${id} API Response:`, response.data);
    
    // レスポンスがdataプロパティを持つ場合
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // レスポンスが直接カテゴリーオブジェクトの場合
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('更新されたカテゴリーデータの形式が不正です');
  } catch (error) {
    console.error(`カテゴリーID:${id}の更新に失敗しました`, error);
    throw error;
  }
};

// カテゴリーを削除
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/categories/${id}`);
  } catch (error) {
    console.error(`カテゴリーID:${id}の削除に失敗しました`, error);
    throw error;
  }
}; 