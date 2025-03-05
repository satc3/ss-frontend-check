import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getShop, createShop, updateShop } from '../../../../services/shopService';
import { ShopFormData } from '../../../../types/shop';

export const ShopFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // フォームデータの初期値
  const initialFormData: ShopFormData = {
    name: '',
    description: '',
    address: '',
    phone: '',
    website: '',
  };

  const [formData, setFormData] = useState<ShopFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 編集モードの場合、既存の店舗データを取得
  useEffect(() => {
    const fetchShop = async () => {
      if (!isEditMode) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getShop(parseInt(id!, 10));
        setFormData({
          name: data.name,
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
          website: data.website || '',
        });
      } catch (err) {
        setError('店舗データの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id, isEditMode]);

  // フォーム入力の変更ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await updateShop(parseInt(id!, 10), formData);
      } else {
        await createShop(formData);
      }
      
      // 成功したら一覧ページに戻る
      navigate('/expenses/shops');
    } catch (err) {
      console.error('店舗の保存に失敗しました', err);
      setError('店舗の保存に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/expenses/shops" className="text-blue-500 hover:text-blue-700 mr-4">
          ← 店舗一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditMode ? '店舗を編集' : '新規店舗を追加'}
        </h1>
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
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                店舗名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="例: スーパーマーケットABC"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="店舗の説明を入力してください"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                住所
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="例: 東京都渋谷区〇〇1-2-3"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                電話番号
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="例: 03-1234-5678"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                ウェブサイト
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="例: https://www.example.com"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              to="/expenses/shops"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? '保存中...' : isEditMode ? '更新する' : '保存する'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 