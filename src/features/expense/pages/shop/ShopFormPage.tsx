import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { getShop, createShop, updateShop } from '@/services/shopService';
import { useApi } from '@/hooks/useApi';
import { handleFormSubmitError } from '@/utils/errorHandler';
import { FormSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Shop } from '@/types/shop';

// バリデーションスキーマを定義
const shopSchema = z.object({
  name: z.string().min(1, '店舗名は必須です'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
});

// フォームの型定義 - Zodスキーマから推論
type FormValues = z.infer<typeof shopSchema>;

export const ShopFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // APIフックの作成
  const { execute: fetchShop, isLoading: isFetching, error: fetchError } = useApi<Shop, number>(getShop);
  
  // 保存用のカスタムフック
  interface SaveShopParams {
    id?: number;
    data: FormValues;
  }

  const { execute: saveShop, isLoading: isSaving } = useApi<Shop, SaveShopParams>(
    async (params) => {
      if (isEditMode && params.id) {
        return await updateShop(params.id, params.data);
      } else {
        return await createShop(params.data);
      }
    },
    {
      onSuccess: () => {
        // 成功したら一覧ページに戻る
        navigate('/expenses/shops');
      }
    }
  );

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      website: '',
    }
  });

  // 編集モードの場合、既存の店舗データを取得
  useEffect(() => {
    const loadShopData = async () => {
      if (!isEditMode) return;
      
      try {
        const data = await fetchShop(parseInt(id!, 10));
        // フォームリセット
        reset({
          name: data.name,
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
          website: data.website || '',
        });
      } catch (error) {
        // エラー処理はuseApiフック内で行われる
        console.error('店舗データ取得エラー:', error);
      }
    };

    loadShopData();
  }, [id, isEditMode, fetchShop, reset]);

  // フォーム送信ハンドラー
  const onSubmit = async (data: FormValues) => {
    try {
      await saveShop({
        id: id ? parseInt(id, 10) : undefined,
        data
      });
    } catch (error) {
      // エラーハンドラを直接渡す
      handleFormSubmitError(error, (fieldName, errorObj) => {
        setError(fieldName as keyof FormValues, errorObj);
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/expenses/shops" className="text-blue-500 hover:text-blue-700 mr-4">
          ← {t('common.back')}
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditMode ? t('shop.form.edit') : t('shop.form.create')}
        </h1>
      </div>

      {/* エラー表示 */}
      {fetchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {fetchError}
        </div>
      )}

      {/* ルートエラー表示 */}
      {errors.root && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.root.message}
        </div>
      )}

      {/* ローディング表示 */}
      {isFetching ? (
        <div className="bg-white shadow rounded-lg p-6">
          <FormSkeleton fields={5} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('shop.name')} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                {...register('name')}
                className={`w-full border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded px-3 py-2`}
                placeholder="例: スーパーマーケットABC"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('shop.description')}
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="店舗の説明を入力してください"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                {t('shop.address')}
              </label>
              <input
                id="address"
                {...register('address')}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="例: 東京都渋谷区〇〇1-2-3"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('shop.phone')}
              </label>
              <input
                id="phone"
                {...register('phone')}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="例: 03-1234-5678"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                {t('shop.website')}
              </label>
              <input
                id="website"
                {...register('website')}
                className={`w-full border ${
                  errors.website ? 'border-red-500' : 'border-gray-300'
                } rounded px-3 py-2`}
                placeholder="例: https://www.example.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              to="/expenses/shops"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              {t('common.cancel')}
            </Link>
            <Button
              type="submit"
              isLoading={isSubmitting || isSaving}
              disabled={isSubmitting || isSaving}
            >
              {isEditMode ? t('common.update') : t('common.save')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}; 