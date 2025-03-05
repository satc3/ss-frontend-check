import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { profileService } from '../../services/profileService';
import { getUser } from '../../store/auth/authSlice';
import type { AxiosProgressEvent } from 'axios';
import { ProfileEditForm } from './components/ProfileEditForm';
import { Link } from 'react-router-dom';

// ファイルサイズを人間が読みやすい形式に変換
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ページロード時にユーザー情報を取得
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(getUser());
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  // 画像のバリデーション
  const validateImage = useCallback((file: File): boolean => {
    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      alert(`ファイルサイズは5MB以下にしてください。\n現在のサイズ: ${formatFileSize(file.size)}`);
      return false;
    }

    // 画像ファイルタイプチェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('アップロードできる画像形式は、JPEG、PNG、WebPのみです');
      return false;
    }

    return true;
  }, []);

  // 画像アップロード処理
  const uploadImage = useCallback(async (file: File) => {
    if (!validateImage(file)) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('avatar', file);

      await profileService.updateAvatar(formData, (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        }
      });
      
      await dispatch(getUser());
    } catch (error) {
      console.error('画像のアップロードに失敗しました:', error);
      alert('画像のアップロードに失敗しました');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [dispatch, validateImage]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
  };

  // ドラッグ&ドロップハンドラー
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (!file) return;
    await uploadImage(file);
  }, [uploadImage]);

  const handleImageDelete = async () => {
    if (!user?.avatar || !confirm('プロフィール画像を削除してもよろしいですか？')) {
      return;
    }

    try {
      setIsDeleting(true);
      await profileService.deleteAvatar();
      await dispatch(getUser());
    } catch (error) {
      console.error('画像の削除に失敗しました:', error);
      alert('画像の削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-8 sm:p-8">
          <div className="flex flex-col items-center">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                <div
                  className="relative group"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user?.name}
                      className={`h-36 w-36 rounded-full border-4 ${
                        isDragging ? 'border-indigo-400 border-dashed' : 'border-white'
                      } shadow-xl transition-all duration-200 object-cover`}
                    />
                  ) : (
                    <div className={`h-36 w-36 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white border-4 ${
                      isDragging ? 'border-indigo-400 border-dashed' : 'border-white'
                    } shadow-xl transition-all duration-200`}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  
                  {/* アップロード中またはデリート中のオーバーレイ */}
                  {(isUploading || isDeleting) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center backdrop-blur-sm">
                      {isUploading ? (
                        <>
                          <div className="w-16 h-16 relative">
                            <svg className="animate-spin h-16 w-16 text-white" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{uploadProgress}%</span>
                            </div>
                          </div>
                          <p className="text-white text-sm mt-2 font-medium">アップロード中...</p>
                        </>
                      ) : (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                      )}
                    </div>
                  )}

                  {/* ドラッグ中のオーバーレイ */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-indigo-500 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <p className="text-white text-sm font-medium drop-shadow">画像をドロップ</p>
                    </div>
                  )}

                  {/* ホバー時のオーバーレイ */}
                  {!isDragging && (
                    <div className="absolute inset-0 bg-transparent rounded-full flex items-center justify-center transition-all duration-300 group-hover:backdrop-blur-sm">
                      <div className="hidden group-hover:flex items-center justify-center space-x-4">
                        <label
                          htmlFor="avatar-upload"
                          className="p-3 text-white cursor-pointer hover:text-gray-200 bg-black/20 rounded-full transition-all duration-200 hover:bg-black/30"
                          title="画像をアップロード"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                        {user?.avatar && (
                          <button
                            onClick={handleImageDelete}
                            className="p-3 text-white cursor-pointer hover:text-red-400 bg-black/20 rounded-full transition-all duration-200 hover:bg-black/30"
                            title="画像を削除"
                            disabled={isDeleting}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImageUpload}
                  disabled={isUploading || isDeleting}
                />

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-gray-500 mb-8 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {user?.email}
                </p>

                <div className="w-full max-w-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      プロフィール編集
                    </h3>
                    <Link
                      to="/settings/password"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      パスワード変更
                    </Link>
                  </div>
                  <ProfileEditForm />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 