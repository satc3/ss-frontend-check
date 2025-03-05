import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getShop, deleteShop } from '../../../../services/shopService';
import { Shop } from '../../../../types/shop';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const ShopDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShop = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getShop(parseInt(id, 10));
        setShop(data);
      } catch (err) {
        setError('店舗データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

  const handleDelete = async () => {
    if (!shop) return;
    
    if (!window.confirm('この店舗を削除してもよろしいですか？')) {
      return;
    }

    try {
      await deleteShop(shop.id);
      navigate('/expenses/shops');
    } catch (err) {
      console.error('店舗の削除に失敗しました', err);
      alert('店舗の削除に失敗しました');
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/expenses/shops" className="text-blue-500 hover:text-blue-700 mr-4">
          ← 店舗一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold">店舗詳細</h1>
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
      ) : shop ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">{shop.name}</h2>
          </div>

          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">住所</dt>
                <dd className="mt-1 text-sm text-gray-900">{shop.address || '-'}</dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                <dd className="mt-1 text-sm text-gray-900">{shop.phone || '-'}</dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">ウェブサイト</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {shop.website ? (
                    <a
                      href={shop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {shop.website}
                    </a>
                  ) : (
                    '-'
                  )}
                </dd>
              </div>

              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">登録日</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(shop.created_at)}</dd>
              </div>

              {shop.description && (
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500">説明</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{shop.description}</dd>
                </div>
              )}
            </dl>

            <div className="mt-8 flex justify-end space-x-4">
              <Link
                to={`/expenses/shops/${shop.id}/edit`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                編集
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-white shadow rounded-lg">
          <p className="text-gray-500">店舗データが見つかりません</p>
        </div>
      )}
    </div>
  );
}; 