import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '@/store/auth/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { AppDispatch } from '@/store';
import type { AuthError } from '@/types/auth';

const schema = z.object({
  email: z.string()
    .min(1, 'メールアドレスは必須です。')
    .email('有効なメールアドレスを入力してください。'),
  password: z.string()
    .min(1, 'パスワードは必須です。'),
});

type LoginFormData = z.infer<typeof schema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('ログインフォーム送信:', data);
      const result = await dispatch(login(data)).unwrap();
      console.log('ログイン結果:', result);
      
      if (result.token) {
        console.log('認証トークンあり - ダッシュボードへリダイレクト');
        navigate('/dashboard');
      } else if (result.user) {
        console.log('ユーザー情報のみあり - ダッシュボードへリダイレクト');
        navigate('/dashboard');
      } else {
        console.error('トークンもユーザー情報もありません');
        setError('root', {
          type: 'manual',
          message: '認証情報が正しく返されませんでした。',
        });
      }
    } catch (error) {
      console.error('ログイン処理エラー:', error);
      const authError = error as AuthError;
      if (authError.message === 'Invalid credentials') {
        setError('root', {
          type: 'manual',
          message: 'メールアドレスまたはパスワードが正しくありません。',
        });
      } else {
        const errorMessages = authError.errors ?? { message: [authError.message ?? 'エラーが発生しました。'] };
        Object.entries(errorMessages).forEach(([key, messages]) => {
          setError(key as keyof LoginFormData, {
            type: 'manual',
            message: messages[0],
          });
        });
      }
    }
  };

  return (
    <>
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          ログイン
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          アカウントにログインしてください
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
            label="メールアドレス"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="パスワード"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              パスワードをお忘れですか？
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full flex justify-center py-2.5"
            isLoading={isSubmitting}
          >
            ログイン
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </form>
    </>
  );
}; 