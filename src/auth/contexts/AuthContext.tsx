import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthResponse, User } from '../../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (response: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const TOKEN_KEY = '@coffee_flow_token';
export const USER_KEY = '@coffee_flow_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (response: AuthResponse) => {
    try {
      if (response.accessToken && response.client) {
        // Сохраняем токен и данные пользователя
        await Promise.all([
          AsyncStorage.setItem(TOKEN_KEY, response.accessToken),
          AsyncStorage.setItem(USER_KEY, JSON.stringify(response.client)),
        ]);

        setUser(response.client);
      } else {
        throw new Error(response.message || 'Ошибка авторизации');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Удаляем токен и данные пользователя
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);

      setUser(null);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Обновляем данные в AsyncStorage
    AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser)).catch((error) =>
      console.error('Ошибка сохранения данных пользователя:', error)
    );
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext должен использоваться внутри AuthProvider');
  }
  return context;
};

export default AuthContext;
