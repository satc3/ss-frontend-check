import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useEffect } from 'react';
import { refreshAuthState } from './utils/auth';

// パブリックアクセス可能なページのリスト
const PUBLIC_PATHS = [
  '/',                  // ランディングページ
  '/login',             // ログインページ
  '/register',          // 登録ページ
  '/forgot-password',   // パスワード忘れページ
  '/reset-password',    // パスワードリセットページ
];

export default function App() {
  // アプリケーション起動時に認証状態をチェック
  useEffect(() => {
    const checkAuth = async () => {
      console.log('認証状態チェック開始');
      
      // 現在のパスを確認
      const currentPath = window.location.pathname;
      console.log('現在のパス:', currentPath);
      
      // パブリックページでは認証チェックをスキップ
      const isPublicPath = PUBLIC_PATHS.some(path => 
        currentPath === path || currentPath.startsWith(`${path}/`)
      );
      
      console.log('パブリックパス判定:', isPublicPath);
      
      if (isPublicPath) {
        console.log('パブリックページのため認証チェックをスキップ');
        return;
      }
      
      try {
        // 効率的な認証チェック（必要な場合のみAPIを呼び出し）
        const isAuthenticated = await refreshAuthState();
        console.log('認証チェック結果:', isAuthenticated);
      } catch (error) {
        console.error('認証状態の確認に失敗しました:', error);
      }
    };
    
    checkAuth();
  }, []);

  return <RouterProvider router={router} />;
}
