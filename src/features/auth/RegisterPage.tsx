import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register as registerAction } from '../../store/auth/authSlice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { AppDispatch } from '../../store';
import type { AuthError } from '../../types/auth';

const schema = z.object({
  name: z.string()
    .min(1, '名前は必須です。')
    .max(255, '名前は255文字以内で入力してください。'),
  email: z.string()
    .min(1, 'メールアドレスは必須です。')
    .email('有効なメールアドレスを入力してください。')
    .max(255, 'メールアドレスは255文字以内で入力してください。'),
  password: z.string()
    .min(1, 'パスワードは必須です。'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'パスワードが一致しません。',
  path: ['password_confirmation'],
});

type RegisterFormData = z.infer<typeof schema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await dispatch(registerAction(data)).unwrap();
      if (result.token) {
        navigate('/dashboard');
      }
    } catch (error) {
      const authError = error as AuthError;
      const errorMessages = authError.errors ?? { message: [authError.message ?? 'エラーが発生しました。'] };
      Object.entries(errorMessages).forEach(([key, messages]) => {
        setError(key as keyof RegisterFormData, {
          type: 'manual',
          message: messages[0],
        });
      });
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          アカウント登録
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          必要な情報を入力してください
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {errors.root.message}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <Input
            label="名前"
            type="text"
            autoComplete="name"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="メールアドレス"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="パスワード"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            label="パスワード（確認）"
            type="password"
            autoComplete="new-password"
            {...register('password_confirmation')}
            error={errors.password_confirmation?.message}
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full flex justify-center py-2.5"
            isLoading={isSubmitting}
          >
            登録
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            すでにアカウントをお持ちの方はこちら
          </Link>
        </div>
      </form>
    </>
  );
}; 