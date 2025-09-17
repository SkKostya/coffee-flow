import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

/**
 * Обработчик ошибок авторизации для API клиентов
 * Используется в конфигурации ProtectedApiClient
 */
export class AuthErrorHandler {
  private static instance: AuthErrorHandler;
  private redirectPath: string | null = null;
  private currentPath: string = '/coffee-shops';

  private constructor() {}

  static getInstance(): AuthErrorHandler {
    if (!AuthErrorHandler.instance) {
      AuthErrorHandler.instance = new AuthErrorHandler();
    }
    return AuthErrorHandler.instance;
  }

  /**
   * Установка текущего пути
   */
  setCurrentPath(path: string) {
    this.currentPath = path;
  }

  /**
   * Обработка ошибки авторизации
   * Сохраняет текущий путь и редиректит на экран логина
   */
  handleAuthError(
    errorMessage: string = 'Ошибка авторизации. Необходимо войти в систему'
  ) {
    // Сохраняем текущий путь для возврата
    this.redirectPath = this.currentPath;

    // Показываем Toast с ошибкой
    Toast.show({
      type: 'error',
      text1: 'Требуется авторизация',
      text2: errorMessage,
      visibilityTime: 6000,
      position: 'top',
      topOffset: 60,
    });

    // Редиректим на экран логина
    router.push('/auth/login');
  }

  /**
   * Обработка успешной авторизации
   * Возвращает пользователя на сохраненный путь или на кофейни
   */
  handleAuthSuccess() {
    const targetPath = this.redirectPath || '/coffee-shops';
    this.clearRedirectPath();
    router.push(targetPath);
  }

  /**
   * Обработка отмены авторизации
   * Редиректит на кофейни
   */
  handleAuthCancel() {
    this.clearRedirectPath();
    router.push('/coffee-shops');
  }

  /**
   * Получение текущего пути
   */
  private getCurrentPath(): string {
    // В Expo Router можно получить текущий путь через router
    // Если это невозможно, возвращаем дефолтный путь
    return '/coffee-shops';
  }

  /**
   * Получение сохраненного пути
   */
  getRedirectPath(): string | null {
    return this.redirectPath;
  }

  /**
   * Очистка сохраненного пути
   */
  clearRedirectPath() {
    this.redirectPath = null;
  }
}

// Экспортируем singleton instance
export const authErrorHandler = AuthErrorHandler.getInstance();
