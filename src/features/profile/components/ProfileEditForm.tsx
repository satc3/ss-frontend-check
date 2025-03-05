import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import { profileService } from '../../../services/profileService';
import { getUser } from '../../../store/auth/authSlice';
import type { ProfileUpdateData } from '../../../types/profile';
import type { AxiosError } from 'axios';

export const ProfileEditForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: user?.name || '',
    kana: user?.kana || '',
    birthday: user?.birthday?.split('T')[0] || '',
    postal_code: user?.postal_code || '',
    address: user?.address || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 入力時にエラーをクリア
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrors({});

    try {
      setIsSubmitting(true);
      await profileService.updateProfile(formData);
      await dispatch(getUser());
      alert('プロフィールを更新しました。');
    } catch (error) {
      const axiosError = error as AxiosError<{ errors?: Record<string, string[]>, message?: string }>;
      console.error('プロフィールの更新に失敗しました:', axiosError.response?.data);
      
      if (axiosError.response?.data?.errors) {
        // バリデーションエラーの処理
        const validationErrors = axiosError.response.data.errors;
        const formattedErrors: Record<string, string> = {};
        Object.entries(validationErrors).forEach(([key, messages]) => {
          formattedErrors[key] = messages[0]; // 最初のエラーメッセージを使用
        });
        setErrors(formattedErrors);
      } else {
        alert(axiosError.response?.data?.message || 'プロフィールの更新に失敗しました。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg ${
              errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } transition duration-150 ease-in-out`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="kana" className="block text-sm font-semibold text-gray-700">
            フリガナ
          </label>
          <input
            type="text"
            id="kana"
            name="kana"
            value={formData.kana}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg ${
              errors.kana
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } transition duration-150 ease-in-out`}
          />
          {errors.kana && (
            <p className="mt-1 text-sm text-red-600">{errors.kana}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="birthday" className="block text-sm font-semibold text-gray-700">
            生年月日
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`block w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg
              [&::-webkit-calendar-picker-indicator]:cursor-pointer
              [&::-webkit-calendar-picker-indicator]:p-0
              [&::-webkit-calendar-picker-indicator]:hover:opacity-70 ${
                errors.birthday
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              } transition duration-150 ease-in-out`}
          />
          {errors.birthday && (
            <p className="mt-1 text-sm text-red-600">{errors.birthday}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="postal_code" className="block text-sm font-semibold text-gray-700">
            郵便番号
          </label>
          <input
            type="text"
            id="postal_code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg ${
              errors.postal_code
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } transition duration-150 ease-in-out`}
            placeholder="1234567"
          />
          {errors.postal_code && (
            <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
            住所
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg ${
              errors.address
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } transition duration-150 ease-in-out`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            電話番号
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`block w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg ${
              errors.phone
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } transition duration-150 ease-in-out`}
            placeholder="09012345678"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-semibold text-gray-700">
            自己紹介
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className={`block w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg ${
              errors.bio
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            } transition duration-150 ease-in-out resize-none`}
            maxLength={1000}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center items-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              更新中...
            </>
          ) : '更新する'}
        </button>
      </div>
    </form>
  );
}; 