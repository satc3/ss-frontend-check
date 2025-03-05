import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getCategories, deleteCategory } from 'services/categoryService';
import { Category, CategoryFilters } from 'types/category';
import Spinner from 'components/ui/Spinner';
import { Alert } from 'components/ui/Alert';
import Pagination from 'components/ui/Pagination';

export const CategoryListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'created_at',
    sort_direction: 'desc'
  });
  const [totalPages, setTotalPages] = useState<number>(1);

  // フィルター変更ハンドラー
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  // ページネーション変更ハンドラー
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // カテゴリーデータの取得
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCategories(filters);
      console.log('カテゴリーAPIレスポンス:', response); // レスポンスの構造を確認
      
      if (response && response.data) {
        setCategories(response.data);
        
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
        setCategories([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('カテゴリー取得エラー:', err);
      setError('カテゴリーの取得中にエラーが発生しました。');
      setCategories([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // カテゴリー削除ハンドラー
  const handleDelete = async (id: number) => {
    if (window.confirm('このカテゴリーを削除してもよろしいですか？')) {
      try {
        await deleteCategory(id);
        // 削除後にリストを更新
        fetchCategories();
      } catch (err) {
        setError('カテゴリーの削除中にエラーが発生しました。');
        console.error('カテゴリー削除エラー:', err);
      }
    }
  };

  // フィルター変更時にカテゴリーを再取得
  useEffect(() => {
    fetchCategories();
  }, [filters, fetchCategories]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">カテゴリー管理</h1>
        <Link
          to="/expenses/categories/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          新規カテゴリー
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
              placeholder="カテゴリー名で検索..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
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
              <option value="name">カテゴリー名</option>
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
      ) : categories.length === 0 ? (
        <div className="bg-white p-8 rounded-md shadow text-center">
          <p className="text-gray-500">カテゴリーが見つかりませんでした。</p>
        </div>
      ) : (
        <>
          {/* カテゴリーテーブル */}
          <div className="bg-white rounded-md shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリー名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カラー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.color && (
                          <span
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></span>
                        )}
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {category.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {category.color ? (
                        <div className="flex items-center">
                          <span
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span className="ml-2 text-sm text-gray-500">{category.color}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/expenses/categories/${category.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="詳細"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/expenses/categories/${category.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="編集"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
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