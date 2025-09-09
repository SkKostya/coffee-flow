// Типы для API запросов и ответов модуля profile

// Базовые типы для профиля пользователя
export interface UserProfile {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  currentCityId: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

// Запрос на получение профиля
export interface GetProfileRequest {
  // Нет параметров для GET запроса
}

// Ответ на получение профиля
export interface GetProfileResponse extends UserProfile {}

// Запрос на обновление профиля
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

// Ответ на обновление профиля
export interface UpdateProfileResponse extends UserProfile {}

// Запрос на удаление аккаунта
export interface DeleteAccountRequest {
  password: string;
}

// Ответ на удаление аккаунта
export interface DeleteAccountResponse {
  message: string;
}

// Запрос на изменение пароля
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Ответ на изменение пароля
export interface ChangePasswordResponse {
  message: string;
}
