import { protectedApiClient } from '../../shared/api';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  DeleteAccountRequest,
  DeleteAccountResponse,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../types/api';

// API сервис для профиля
export const profileApi = {
  // Получение профиля пользователя
  async getProfile() {
    return protectedApiClient.get<GetProfileResponse>('/clients/profile');
  },

  // Обновление профиля пользователя
  async updateProfile(data: UpdateProfileRequest) {
    return protectedApiClient.put<UpdateProfileResponse>(
      '/clients/profile',
      data
    );
  },

  // Удаление аккаунта
  async deleteAccount(data: DeleteAccountRequest) {
    return protectedApiClient.delete<DeleteAccountResponse>(
      '/clients/profile',
      data
    );
  },

  // Изменение пароля
  async changePassword(data: ChangePasswordRequest) {
    return protectedApiClient.put<ChangePasswordResponse>(
      '/clients/change-password',
      data
    );
  },
};

export default profileApi;
