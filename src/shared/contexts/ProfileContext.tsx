import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TOKEN_KEY, USER_KEY } from '../../auth/contexts/AuthContext';
import { profileApi } from '../../profile/services/profileApi';
import { UserProfile } from '../../profile/types/api';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  refetch: () => Promise<void>;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: React.ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    setProfile(null);
    setError(null);
    AsyncStorage.removeItem(TOKEN_KEY);
    AsyncStorage.removeItem(USER_KEY);
    router.navigate('/auth/login');
  }, []);

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

  // Изменение пароля
  const changePassword = useCallback(
    async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      try {
        setError(null);

        const response = await profileApi.changePassword(data);

        if (response.success) {
          return { success: true };
        } else {
          const errorMessage = response.error || 'Ошибка изменения пароля';
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка изменения пароля';
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
        logout();
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

  // Очистка профиля (при выходе)
  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  // Загружаем профиль при инициализации
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    logout,
    refetch: loadProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    clearProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};

export default ProfileContext;
