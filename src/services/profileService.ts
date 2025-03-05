import { api } from '../lib/axios';
import type { AxiosProgressEvent } from 'axios';
import type { ProfileUpdateData, ProfileResponse } from '../types/profile';

export const profileService = {
  /**
   * プロフィール情報を更新
   */
  async updateProfile(data: ProfileUpdateData): Promise<ProfileResponse> {
    // 空の値を除外
    const cleanedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).filter(([_, value]) => value !== '')
    );

    const response = await api.patch('/api/profile', cleanedData);
    return response.data;
  },

  /**
   * プロフィール画像をアップロード
   */
  async updateAvatar(formData: FormData, onProgress?: (progressEvent: AxiosProgressEvent) => void) {
    const response = await api.post('/api/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
    return response.data;
  },

  /**
   * プロフィール画像を削除
   */
  async deleteAvatar() {
    const response = await api.delete('/api/profile/avatar');
    return response.data;
  },
}; 