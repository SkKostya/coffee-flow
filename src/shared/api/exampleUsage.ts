/**
 * Пример использования ProtectedApiClient с обработкой ошибок авторизации
 */

import { protectedApiClient } from './ProtectedApiClient';

// Пример защищенного запроса
export const exampleProtectedRequest = async () => {
  try {
    // Этот запрос автоматически обработает ошибки 401/403
    // и редиректит пользователя на экран логина
    const response = await protectedApiClient.get('/api/protected-endpoint');

    console.log('Данные получены:', response.data);
    return response.data;
  } catch (error) {
    // Ошибки авторизации уже обработаны в ProtectedApiClient
    // Здесь обрабатываем только другие ошибки
    console.error('Ошибка запроса:', error);
    throw error;
  }
};

// Пример POST запроса
export const exampleProtectedPost = async (data: any) => {
  try {
    const response = await protectedApiClient.post(
      '/api/protected-endpoint',
      data
    );

    console.log('Данные отправлены:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка отправки данных:', error);
    throw error;
  }
};
