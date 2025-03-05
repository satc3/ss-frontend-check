import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getShops, deleteShop } from '../../../../services/shopService';
import { Shop, ShopFilters } from '../../../../types/shop';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const ShopListPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ShopFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'name',
    sort_direction: 'asc',
  });
  const [totalPages, setTotalPages] = useState(0);

  // フィルターの変更ハンドラー
  const handleFilterChange = (name: string, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // フィルター変更時はページを1に戻す
    }));
  };

  // ページネーションハンドラー
  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  // 店舗データの取得
  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getShops(filters);
      setShops(response.data);
      setTotalPages(response.meta.last_page);
    } catch (err) {
      setError('店舗データの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 店舗の削除
  const handleDelete = async (id: number) => {
    if (!window.confirm('この店舗を削除してもよろしいですか？')) {
      return;
    }

    try {
      await deleteShop(id);
      // 削除後にリストを更新
      fetchShops();
    } catch (err) {
      console.error('店舗の削除に失敗しました', err);
      alert('店舗の削除に失敗しました');
    }
  };

  // フィルター変更時にデータを再取得
  useEffect(() => {
    fetchShops();
  }, [filters, fetchShops]);

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">店舗一覧</h1>
        <Link
          to="/expenses/shops/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          新規店舗を追加
        </Link>
      </div>

      {/* フィルターセクション */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">検索フィルター</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              検索
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="店舗名または住所で検索"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              並び順
            </label>
            <div className="flex space-x-2">
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={filters.sort_by || 'name'}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              >
                <option value="name">店舗名</option>
                <option value="created_at">登録日</option>
              </select>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={filters.sort_direction || 'asc'}
                onChange={(e) => handleFilterChange('sort_direction', e.target.value as 'asc' | 'desc')}
              >
                <option value="asc">昇順</option>
                <option value="desc">降順</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
            onClick={() => setFilters({
              page: 1,
              per_page: 10,
              sort_by: 'name',
              sort_direction: 'asc',
            })}
          >
            リセット
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => fetchShops()}
          >
            検索
          </button>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ローディング表示 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      ) : (
        <>
          {/* 店舗一覧テーブル */}
          {shops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      店舗名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      住所
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      電話番号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登録日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.address || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shop.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(shop.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <Link
                            to={`/expenses/shops/${shop.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            詳細
                          </Link>
                          <Link
                            to={`/expenses/shops/${shop.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => handleDelete(shop.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white shadow rounded-lg">
              <p className="text-gray-500">店舗データがありません</p>
            </div>
          )}

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                  disabled={(filters.page || 1) <= 1}
                  className={`mx-1 px-3 py-1 rounded ${
                    (filters.page || 1) <= 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  前へ
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`mx-1 px-3 py-1 rounded ${
                      page === (filters.page || 1)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
                  disabled={(filters.page || 1) >= totalPages}
                  className={`mx-1 px-3 py-1 rounded ${
                    (filters.page || 1) >= totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  次へ
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 