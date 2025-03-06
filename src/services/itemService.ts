import api from '@/lib/axios';
import { Item, ItemFormData, ItemFilters, PaginatedItems } from '@/types/item';

// 商品一覧を取得
export const getItems = async (filters: ItemFilters = {}): Promise<PaginatedItems> => {
  try {
    const response = await api.get('/api/items', { params: filters });
    
    // APIレスポンスの形式を確認
    console.log('Items API Response:', response.data);
    
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
    console.error('商品一覧の取得に失敗しました', error);
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

// 商品詳細を取得
export const getItem = async (id: number): Promise<Item> => {
  try {
    const response = await api.get(`/api/items/${id}`);
    
    // APIレスポンスの形式を確認
    console.log(`Item ${id} API Response:`, response.data);
    
    // レスポンスがdataプロパティを持つ場合
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // レスポンスが直接商品オブジェクトの場合
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('商品データの形式が不正です');
  } catch (error) {
    console.error(`商品ID:${id}の取得に失敗しました`, error);
    throw error;
  }
};

// 商品を作成
export const createItem = async (data: ItemFormData): Promise<Item> => {
  try {
    const response = await api.post('/api/items', data);
    
    // APIレスポンスの形式を確認
    console.log('Create Item API Response:', response.data);
    
    // レスポンスがdataプロパティを持つ場合
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // レスポンスが直接商品オブジェクトの場合
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('作成された商品データの形式が不正です');
  } catch (error) {
    console.error('商品の作成に失敗しました', error);
    throw error;
  }
};

// 商品を更新
export const updateItem = async (id: number, data: ItemFormData): Promise<Item> => {
  try {
    const response = await api.put(`/api/items/${id}`, data);
    
    // APIレスポンスの形式を確認
    console.log(`Update Item ${id} API Response:`, response.data);
    
    // レスポンスがdataプロパティを持つ場合
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    // レスポンスが直接商品オブジェクトの場合
    if (response.data && response.data.id) {
      return response.data;
    }
    
    throw new Error('更新された商品データの形式が不正です');
  } catch (error) {
    console.error(`商品ID:${id}の更新に失敗しました`, error);
    throw error;
  }
};

// 商品を削除
export const deleteItem = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/items/${id}`);
  } catch (error) {
    console.error(`商品ID:${id}の削除に失敗しました`, error);
    throw error;
  }
}; 