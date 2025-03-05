import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getItem, deleteItem } from '../../../../services/itemService';
import { getCategories } from '../../../../services/categoryService';
import { Item } from '../../../../types/item';
import { Category } from '../../../../types/category';
import Spinner from '../../../../components/ui/Spinner';
import { Alert } from '../../../../components/ui/Alert';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 商品削除ハンドラー
  const handleDelete = async () => {
    if (!item) return;
    
    if (window.confirm('この商品を削除してもよろしいですか？')) {
      try {
        await deleteItem(item.id);
        navigate('/expenses/items');
      } catch (err) {
        setError('商品の削除中にエラーが発生しました。');
        console.error('商品削除エラー:', err);
      }
    }
  };

  // カテゴリー名を取得
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return '-';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '-';
  };

  // 商品データとカテゴリーデータの取得
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // カテゴリーデータを取得
        const categoriesResponse = await getCategories();
        if (categoriesResponse && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
        // 商品データを取得
        const data = await getItem(parseInt(id));
        setItem(data);
      } catch (err) {
        setError('商品の取得中にエラーが発生しました。');
        console.error('商品取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/expenses/items"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          商品一覧に戻る
        </Link>
      </div>

      {/* エラーメッセージ */}
      {error && <Alert type="error" message={error} className="mb-4" />}

      {/* ローディングインジケーター */}
      {loading ? (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      ) : !item ? (
        <div className="bg-white p-8 rounded-md shadow text-center">
          <p className="text-gray-500">商品が見つかりませんでした。</p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-16 w-16 rounded-md mr-4 object-cover"
                  />
                )}
                <h1 className="text-2xl font-bold text-gray-800">{item.name}</h1>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/expenses/items/${item.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  編集
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  削除
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">基本情報</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">商品名</p>
                    <p className="text-gray-800">{item.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">説明</p>
                    <p className="text-gray-800">{item.description || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">カテゴリー</p>
                    <p className="text-gray-800">{getCategoryName(item.category_id)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">追加情報</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">バーコード</p>
                    <p className="text-gray-800">{item.barcode || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="text-gray-800">{item.sku || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="text-gray-800">{item.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 