import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getCategory, createCategory, updateCategory } from 'services/categoryService';
import { CategoryFormData } from 'types/category';
import Spinner from 'components/ui/Spinner';
import { Alert } from 'components/ui/Alert';

export const CategoryFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // 初期フォームデータ
  const initialFormData: CategoryFormData = {
    name: '',
    description: '',
    color: '',
    icon: ''
  };

  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 編集モードの場合、カテゴリーデータを取得
  useEffect(() => {
    if (isEditMode) {
      const fetchCategoryData = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getCategory(parseInt(id));
          setFormData({
            name: data.name,
            description: data.description || '',
            color: data.color || '',
            icon: data.icon || ''
          });
        } catch (err) {
          setError('カテゴリーの取得中にエラーが発生しました。');
          console.error('カテゴリー取得エラー:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchCategoryData();
    }
  }, [id, isEditMode]);

  // フォーム入力変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 入力時にバリデーションエラーをクリア
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // カラーピッカーの色変更ハンドラー
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, color: e.target.value }));
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'カテゴリー名は必須です。';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await updateCategory(parseInt(id), formData);
      } else {
        await createCategory(formData);
      }
      navigate('/expenses/categories');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: Record<string, string> } } };
      if (error.response && error.response.data && error.response.data.errors) {
        // APIからのバリデーションエラー
        setValidationErrors(error.response.data.errors);
      } else {
        setError(`カテゴリーの${isEditMode ? '更新' : '作成'}中にエラーが発生しました。`);
      }
      console.error(`カテゴリー${isEditMode ? '更新' : '作成'}エラー:`, err);
    } finally {
      setSubmitting(false);
    }
  };

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

      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditMode ? 'カテゴリーを編集' : '新規カテゴリー作成'}
          </h1>

          {/* エラーメッセージ */}
          {error && <Alert type="error" message={error} className="mb-4" />}

          {/* ローディングインジケーター */}
          {loading ? (
            <div className="flex justify-center my-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* カテゴリー名 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    カテゴリー名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full border ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="例: 食費、交通費など"
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>

                {/* 説明 */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="カテゴリーの説明（任意）"
                  />
                </div>

                {/* カラー */}
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                    カラー
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={formData.color || '#3B82F6'}
                      onChange={handleColorChange}
                      className="h-10 w-10 border-0 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      name="color"
                      value={formData.color || ''}
                      onChange={handleChange}
                      className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#HEX値（例: #3B82F6）"
                    />
                  </div>
                </div>

                {/* アイコン */}
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                    アイコン
                  </label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={formData.icon || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="アイコン名（任意）"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    将来的にアイコン選択機能を実装予定です。現在はテキストのみ保存されます。
                  </p>
                </div>

                {/* 送信ボタン */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Link
                    to="/expenses/categories"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    キャンセル
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitting && <Spinner size="sm" className="mr-2" />}
                    {isEditMode ? '更新する' : '作成する'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}; 