import { useCallback, useEffect, useState } from 'react';
import { profileApi } from '../services/profileApi';
import { UserProfile } from '../types/api';

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка профиля
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await profileApi.getProfile();

      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.error || 'Ошибка загрузки профиля');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки профиля';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Обновление профиля
  const updateProfile = useCallback(
    async (data: { firstName: string; lastName: string; email: string }) => {
      try {
        setError(null);

        const response = await profileApi.updateProfile(data);

        if (response.success && response.data) {
          setProfile(response.data);
          return { success: true };
        } else {
          const errorMessage = response.error || 'Ошибка обновления профиля';
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка обновления профиля';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // Удаление аккаунта
  const deleteAccount = useCallback(async (password: string) => {
    try {
      setError(null);

      const response = await profileApi.deleteAccount({ password });

      if (response.success) {
        setProfile(null);
        return { success: true };
      } else {
        const errorMessage = response.error || 'Ошибка удаления аккаунта';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка удаления аккаунта';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Загружаем профиль при инициализации
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: loadProfile,
    updateProfile,
    deleteAccount,
  };
};
