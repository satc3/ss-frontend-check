import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getCategory, deleteCategory } from 'services/categoryService';
import { Category } from 'types/category';
import Spinner from 'components/ui/Spinner';
import { Alert } from 'components/ui/Alert';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  // カテゴリー削除ハンドラー
  const handleDelete = async () => {
    if (!category) return;
    
    if (window.confirm('このカテゴリーを削除してもよろしいですか？')) {
      try {
        await deleteCategory(category.id);
        navigate('/expenses/categories');
      } catch (err) {
        setError('カテゴリーの削除中にエラーが発生しました。');
        console.error('カテゴリー削除エラー:', err);
      }
    }
  };

  // カテゴリーデータの取得
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getCategory(parseInt(id));
        setCategory(data);
      } catch (err) {
        setError('カテゴリーの取得中にエラーが発生しました。');
        console.error('カテゴリー取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/expenses/categories"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          カテゴリー一覧に戻る
        </Link>
      </div>

      {/* エラーメッセージ */}
      {error && <Alert type="error" message={error} className="mb-4" />}

      {/* ローディングインジケーター */}
      {loading ? (
        <div className="flex justify-center my-8">
          <Spinner size="lg" />
        </div>
      ) : !category ? (
        <div className="bg-white p-8 rounded-md shadow text-center">
          <p className="text-gray-500">カテゴリーが見つかりませんでした。</p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                {category.color && (
                  <span
                    className="w-8 h-8 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  ></span>
                )}
                <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/expenses/categories/${category.id}/edit`}
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
                    <p className="text-sm text-gray-500">カテゴリー名</p>
                    <p className="text-gray-800">{category.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">説明</p>
                    <p className="text-gray-800">{category.description || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">カラー</p>
                    {category.color ? (
                      <div className="flex items-center">
                        <span
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></span>
                        <span>{category.color}</span>
                      </div>
                    ) : (
                      <p className="text-gray-800">-</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">アイコン</p>
                    <p className="text-gray-800">{category.icon || '-'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">システム情報</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="text-gray-800">{category.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">作成日時</p>
                    <p className="text-gray-800">{formatDate(category.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">更新日時</p>
                    <p className="text-gray-800">{formatDate(category.updated_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ユーザーID</p>
                    <p className="text-gray-800">{category.user_id || 'システム共通'}</p>
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