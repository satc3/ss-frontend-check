import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getItem, createItem, updateItem } from '../../../../services/itemService';
import { getCategories } from '../../../../services/categoryService';
import { ItemFormData } from '../../../../types/item';
import { Category } from '../../../../types/category';
import Spinner from '../../../../components/ui/Spinner';
import { Alert } from '../../../../components/ui/Alert';

export const ItemFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // 初期フォームデータ
  const initialFormData: ItemFormData = {
    name: '',
    description: '',
    category_id: undefined,
    image_url: '',
    barcode: '',
    sku: ''
  };

  const [formData, setFormData] = useState<ItemFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // カテゴリーデータの取得
  useEffect(() => {
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

    fetchCategories();
  }, []);

  // 編集モードの場合、商品データを取得
  useEffect(() => {
    if (isEditMode) {
      const fetchItemData = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getItem(parseInt(id));
          setFormData({
            name: data.name,
            description: data.description || '',
            category_id: data.category_id,
            image_url: data.image_url || '',
            barcode: data.barcode || '',
            sku: data.sku || ''
          });
        } catch (err) {
          setError('商品の取得中にエラーが発生しました。');
          console.error('商品取得エラー:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchItemData();
    }
  }, [id, isEditMode]);

  // フォーム入力変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // 数値型のフィールドを処理
    if (type === 'number') {
      const numValue = value ? Number(value) : undefined;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } 
    // セレクトボックスの処理
    else if (name === 'category_id') {
      const categoryId = value ? Number(value) : undefined;
      setFormData(prev => ({ ...prev, [name]: categoryId }));
    }
    // その他のフィールド
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // 入力時にバリデーションエラーをクリア
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = '商品名は必須です。';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await updateItem(parseInt(id), formData);
      } else {
        await createItem(formData);
      }
      navigate('/expenses/items');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: Record<string, string> } } };
      if (error.response && error.response.data && error.response.data.errors) {
        // APIからのバリデーションエラー
        setValidationErrors(error.response.data.errors);
      } else {
        setError(`商品の${isEditMode ? '更新' : '作成'}中にエラーが発生しました。`);
      }
      console.error(`商品${isEditMode ? '更新' : '作成'}エラー:`, err);
    } finally {
      setSubmitting(false);
    }
  };

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

      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isEditMode ? '商品を編集' : '新規商品作成'}
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
                {/* 商品名 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    商品名 <span className="text-red-500">*</span>
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
                    placeholder="商品名を入力"
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
                    placeholder="商品の説明（任意）"
                  />
                </div>

                {/* カテゴリー */}
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                    カテゴリー
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">カテゴリーを選択（任意）</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 画像URL */}
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                    画像URL
                  </label>
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="画像のURL（任意）"
                  />
                </div>

                {/* バーコード */}
                <div>
                  <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
                    バーコード
                  </label>
                  <input
                    type="text"
                    id="barcode"
                    name="barcode"
                    value={formData.barcode || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="バーコード（任意）"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SKU（任意）"
                  />
                </div>

                {/* 送信ボタン */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Link
                    to="/expenses/items"
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