import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { api } from '../../lib/axios';
import { ApiError } from '../../types/api';

const schema = z.object({
  email: z.string()
    .email('有効なメールアドレスを入力してください。')
    .max(255, 'メールアドレスは255文字以内で入力してください。'),
});

type ForgotPasswordFormData = z.infer<typeof schema>;

export const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await api.post('/api/forgot-password', data);
      setIsSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        const apiError = error as ApiError;
        const errorMessages = apiError.response?.data?.errors ?? { email: ['エラーが発生しました。'] };
        Object.entries(errorMessages).forEach(([key, messages]) => {
          setError(key as keyof ForgotPasswordFormData, {
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
          パスワードリセットリンクを送信しました。
          <br />
          メールをご確認ください。
        </Alert>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            メールが届かない場合は、迷惑メールフォルダもご確認ください。
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ログインページに戻る
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          パスワードをお忘れの方
        </h2>
        <p className="mt-4 text-center text-sm text-gray-600">
          登録したメールアドレスを入力してください。
          <br />
          パスワードリセットのリンクをお送りします。
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="メールアドレス"
          type="email"
          autoComplete="email"
          placeholder="example@smartspend.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full py-2.5"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'メール送信中...' : 'パスワードリセットメールを送信'}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ログインページに戻る
            </Link>
          </div>
        </div>
      </form>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <p className="text-xs text-gray-500 text-center">
          ※ パスワードリセットのメールは、セキュリティのため60分間有効です。
          <br />
          メールが届かない場合は、迷惑メールフォルダもご確認ください。
        </p>
      </div>
    </>
  );
}; 