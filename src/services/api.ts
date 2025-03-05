import axios from 'axios';

// カスタム設定型の拡張
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    retryCount?: number;
  }
}

// APIのベースURL（末尾のapiは不要、各エンドポイントで/apiを含める）
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost';
// ストレージのベースURL
export const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || BASE_URL;

// リトライ設定
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1秒

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// CSRFトークンを初期化
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
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // リトライカウントを初期化
        config.retryCount = 0;
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
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default api; 