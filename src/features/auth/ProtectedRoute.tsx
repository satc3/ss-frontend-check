import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { refreshAuthState } from '@/utils/auth';

export const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(isAuthenticated);

  console.log('ProtectedRoute - 初期認証状態:', { isAuthenticated, user });

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute - 認証チェック開始');
      try {
        const authenticated = await refreshAuthState();
        console.log('ProtectedRoute - 認証チェック結果:', authenticated);
        setIsAuthorized(authenticated);
      } catch (error) {
        console.error('認証チェックエラー:', error);
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated]);

  console.log('ProtectedRoute - 最終判定:', { isChecking, isAuthorized });

  if (isChecking) {
    return <div>認証状態を確認中...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}; 