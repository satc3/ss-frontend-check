import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getItems, deleteItem } from '../../../../services/itemService';
import { getCategories } from '../../../../services/categoryService';
import { Item, ItemFilters } from '../../../../types/item';
import { Category } from '../../../../types/category';
import Spinner from '../../../../components/ui/Spinner';
import { Alert } from '../../../../components/ui/Alert';
import Pagination from '../../../../components/ui/Pagination';

export const ItemListPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ItemFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'created_at',
    sort_direction: 'desc'
  });
  const [totalPages, setTotalPages] = useState<number>(1);

  // フィルター変更ハンドラー
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 数値型のフィルターを処理
    if (['category_id', 'per_page'].includes(name)) {
      const numValue = value ? Number(value) : undefined;
      setFilters(prev => ({ ...prev, [name]: numValue, page: 1 }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    }
  };

  // ページネーション変更ハンドラー
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // 商品データの取得
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getItems(filters);
      console.log('商品APIレスポンス:', response);
      
      if (response && response.data) {
        setItems(response.data);
        
        // ページネーション情報の取得（様々な形式に対応）
        let totalPagesValue = 1;
        
        // meta.last_pageがある場合
        if (response.meta?.last_page) {
          totalPagesValue = response.meta.last_page;
        } 
        // トップレベルのlast_pageがある場合
        else if (response.last_page) {
          totalPagesValue = response.last_page;
        }
        // 総数とページあたりの件数から計算する場合
        else if ((response.meta?.total || response.total) && (response.meta?.per_page || response.per_page)) {
          const total = response.meta?.total || response.total || 0;
          const perPage = response.meta?.per_page || response.per_page || 10;
          totalPagesValue = Math.ceil(total / perPage);
          if (totalPagesValue < 1) totalPagesValue = 1;
        }
        
        setTotalPages(totalPagesValue);
      } else {
        setItems([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('商品取得エラー:', err);
      setError('商品の取得中にエラーが発生しました。');
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // カテゴリーデータの取得
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('カテゴリー取得エラー:', err);
    }
  };

  // 商品削除ハンドラー
  const handleDelete = async (id: number) => {
    if (window.confirm('この商品を削除してもよろしいですか？')) {
      try {
        await deleteItem(id);
        // 削除後にリストを更新
        fetchItems();
      } catch (err) {
        setError('商品の削除中にエラーが発生しました。');
        console.error('商品削除エラー:', err);
      }
    }
  };

  // フィルター変更時に商品を再取得
  useEffect(() => {
    fetchItems();
  }, [filters, fetchItems]);

  // 初回レンダリング時にカテゴリーを取得
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">商品管理</h1>
        <Link
          to="/expenses/items/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          新規商品
        </Link>
      </div>

      {/* フィルターセクション */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              検索
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search || ''}
              onChange={handleFilterChange}
              placeholder="商品名で検索..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリー
            </label>
            <select
              id="category_id"
              name="category_id"
              value={filters.category_id || ''}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">すべてのカテゴリー</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort_by" className="block text-sm font-medium text-gray-700 mb-1">
              並び替え項目
            </label>
            <select
              id="sort_by"
              name="sort_by"
              value={filters.sort_by || 'created_at'}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="name">商品名</option>
              <option value="created_at">作成日</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort_direction" className="block text-sm font-medium text-gray-700 mb-1">
              並び順
            </label>
            <select
              id="sort_direction"
              name="sort_direction"
              value={filters.sort_direction || 'desc'}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="asc">昇順</option>
              <option value="desc">降順</option>
            </select>
          </div>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && <Alert type="error" message={error} className="mb-4" />}

      {/* ローディングインジケーター */}
      {loading ? (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-8 rounded-md shadow text-center">
          <p className="text-gray-500">商品が見つかりませんでした。</p>
        </div>
      ) : (
        <>
          {/* 商品テーブル */}
          <div className="bg-white rounded-md shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリー
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-10 w-10 rounded-full mr-3 object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category_id ? 
                        categories.find(c => c.id === item.category_id)?.name || '-' 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/expenses/items/${item.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="詳細"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/expenses/items/${item.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="編集"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="削除"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          <div className="mt-4">
            <Pagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}; 