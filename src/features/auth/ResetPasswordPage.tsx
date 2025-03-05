import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { api } from '../../lib/axios';
import { ApiError } from '../../types/api';

const schema = z.object({
  email: z.string()
    .email('有効なメールアドレスを入力してください。')
    .max(255, 'メールアドレスは255文字以内で入力してください。'),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください。')
    .regex(/[A-Z]/, 'パスワードには大文字を含める必要があります。')
    .regex(/[a-z]/, 'パスワードには小文字を含める必要があります。')
    .regex(/[0-9]/, 'パスワードには数字を含める必要があります。')
    .regex(/[^A-Za-z0-9]/, 'パスワードには記号を含める必要があります。'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'パスワードが一致しません。',
  path: ['password_confirmation'],
});

type ResetPasswordFormData = z.infer<typeof schema>;

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
  });

  // URLからemailとtokenを取得して設定
  useState(() => {
    const email = searchParams.get('email');
    if (email) {
      setValue('email', email);
    }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const token = searchParams.get('token');
      if (!token) {
        throw new Error('トークンが見つかりません。');
      }

      await api.post('/api/reset-password', {
        ...data,
        token,
      });
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const apiError = error as ApiError;
        const errorMessages = apiError.response?.data?.errors ?? { email: ['エラーが発生しました。'] };
        Object.entries(errorMessages).forEach(([key, messages]) => {
          setError(key as keyof ResetPasswordFormData, {
            type: 'manual',
            message: messages[0],
          });
        });
      }
    }
  };

  if (isSuccess) {
    return (
      <>
        <Alert type="success" className="mb-6">
          パスワードをリセットしました。
          <br />
          3秒後にログインページに移動します。
        </Alert>
        <div className="text-center">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ログインページに移動
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          新しいパスワードの設定
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          新しいパスワードを入力してください。
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Input
            label="メールアドレス"
            type="email"
            autoComplete="email"
            readOnly
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="新しいパスワード"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="新しいパスワード（確認）"
            type="password"
            autoComplete="new-password"
            {...register('password_confirmation')}
            error={errors.password_confirmation?.message}
          />
        </div>

        <div>
          <Button
            type="submit"
            className="w-full flex justify-center py-2.5"
            isLoading={isSubmitting}
          >
            パスワードを変更
          </Button>
        </div>

        <div className="text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ログインページに戻る
          </Link>
        </div>
      </form>
    </>
  );
}; 