import { toast } from 'react-toastify';

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * API呼び出し時のエラーを一貫性を持って処理するユーティリティ関数
 * @param error - エラーオブジェクト
 * @param setFormError - フォームエラーをセットするコールバック関数（オプション）
 */
export const handleApiError = (error: unknown, setFormError?: (field: string, message: string) => void): void => {
  console.error('API Error:', error);
  
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: ErrorResponse } };
    const errorData = apiError.response?.data;
    
    // フォームエラーの場合
    if (errorData?.errors && setFormError) {
      Object.entries(errorData.errors).forEach(([field, messages]) => {
        setFormError(field, messages[0]);
      });
    } 
    // 一般的なエラーメッセージの場合
    else if (errorData?.message) {
      toast.error(errorData.message);
    } else {
      toast.error('予期せぬエラーが発生しました。');
    }
  } else {
    toast.error('サーバーとの通信に失敗しました。');
  }
};

/**
 * フォーム送信時の共通エラーハンドラー
 * @param error - エラーオブジェクト
 * @param setError - React Hook FormのsetError関数
 */
export const handleFormSubmitError = (
  error: unknown, 
  setError: (fieldName: string, error: { type: string; message: string }) => void
): void => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: ErrorResponse } };
    const errorData = apiError.response?.data;
    
    if (errorData?.errors) {
      // フィールドごとのエラーをセット
      Object.entries(errorData.errors).forEach(([field, messages]) => {
        setError(field, {
          type: 'server',
          message: messages[0]
        });
      });
    } else if (errorData?.message) {
      // フォーム全体のエラーをセット
      setError('root', {
        type: 'server',
        message: errorData.message
      });
      toast.error(errorData.message);
    } else {
      toast.error('フォームの送信に失敗しました。');
    }
  } else {
    toast.error('サーバーとの通信に失敗しました。');
  }
}; 