import { store } from '@/store';
import { getUser } from '@/store/auth/authSlice';

// 最後に認証チェックが行われた時間を追跡
let lastAuthCheck = 0;
const AUTH_CHECK_INTERVAL = 60000; // 1分間隔でAPIチェック

/**
 * ユーザーが認証済みかどうかをストアから確認
 */
export const isAuthenticated = (): boolean => {
  const state = store.getState();
  const result = state.auth.isAuthenticated && !!state.auth.token;
  console.log('認証状態確認 (ストアから):', result, state.auth);
  return result;
};

/**
 * ローカルストレージからトークンを取得
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * 認証状態を更新
 * 一定間隔でのみAPIリクエストを実行して、過剰なリクエストを防止
 */
export const refreshAuthState = async (): Promise<boolean> => {
  console.log('認証状態更新開始');
  const now = Date.now();
  
  // すでに認証済みなら即時return
  if (isAuthenticated()) {
    console.log('すでに認証済みのため、APIチェックをスキップ');
    return true;
  }
  
  // トークンがなければ未認証
  const token = getToken();
  if (!token) {
    console.log('トークンがないため、未認証と判断');
    return false;
  }
  
  // 前回のチェックから一定時間経過していない場合はAPIコールをスキップ
  if (now - lastAuthCheck < AUTH_CHECK_INTERVAL) {
    console.log('前回のチェックから十分な時間が経過していないため、APIチェックをスキップ');
    return false;
  }
  
  lastAuthCheck = now;
  console.log('APIを使用して認証状態をチェック');
  
  try {
    const result = await store.dispatch(getUser()).unwrap();
    console.log('APIによる認証状態チェック結果:', result);
    return isAuthenticated();
  } catch (error) {
    console.error('認証状態の更新に失敗しました:', error);
    // エラーの場合はトークンを削除して未認証状態にする
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

/**
 * 認証が必要なページのガード処理
 * ログインしていない場合は/loginにリダイレクト
 */
export const requireAuth = async (): Promise<boolean> => {
  console.log('認証ガード処理開始');
  const authenticated = await refreshAuthState();
  console.log('認証ガード結果:', authenticated);
  if (!authenticated) {
    console.log('未認証のため、ログインページにリダイレクト');
    window.location.href = '/login';
    return false;
  }
  return true;
}; 