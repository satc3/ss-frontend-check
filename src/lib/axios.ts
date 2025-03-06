import axios from 'axios';

// カスタム設定型の拡張
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    retryCount?: number;
    skipAuthRedirect?: boolean;
  }
}

// APIのベースURL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost';
// ストレージのベースURL
export const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || BASE_URL;

// リトライ設定
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1秒

// パブリックアクセス可能なページのリスト
const PUBLIC_PATHS = [
  '/',                  // ランディングページ
  '/login',             // ログインページ
  '/register',          // 登録ページ
  '/forgot-password',   // パスワード忘れページ
  '/reset-password',    // パスワードリセットページ
];

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // クッキーを送信・受信可能にする
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Laravel Sanctum対応
  },
  // クロスドメインクッキーを処理するためのCORS設定
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// CSRFトークンの初期化
export const initializeCsrf = async () => {
  try {
    await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('CSRF初期化エラー:', error);
    throw error;
  }
};

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // トークンをローカルストレージから取得
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // リトライカウントを初期化
    config.retryCount = 0;
    
    // ログイン関連のエンドポイントでは認証リダイレクトをスキップ
    if (
      config.url?.includes('/login') || 
      config.url?.includes('/register') || 
      config.url?.includes('/forgot-password') || 
      config.url?.includes('/reset-password')
    ) {
      config.skipAuthRedirect = true;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // リクエスト設定を取得
    const config = error.config;
    
    // 429エラー（Too Many Requests）の場合、リトライ処理
    if (error.response?.status === 429 && (!config.retryCount || config.retryCount < MAX_RETRIES)) {
      config.retryCount = config.retryCount || 0;
      config.retryCount += 1;
      
      // エクスポネンシャルバックオフによる待機時間を計算
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, config.retryCount - 1);
      console.log(`429エラー: ${config.retryCount}回目のリトライを${delay}ms後に実行します`, config.url);
      
      // 指定時間待機
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // リクエスト再試行
      return api(config);
    }
    
    // 401エラー（認証切れ）の場合、ログイン画面にリダイレクト
    // ただし、認証関連のエンドポイントや、現在のURLがパブリックページならリダイレクトしない
    if (error.response?.status === 401 && !config.skipAuthRedirect) {
      // 現在のパスを確認
      const currentPath = window.location.pathname;
      const isPublicPath = PUBLIC_PATHS.some(path => 
        currentPath === path || currentPath.startsWith(`${path}/`)
      );
      
      if (!isPublicPath) {
        // トークンを削除してログアウト状態にする
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 