import { useCallback } from 'react';
import { AuthResponse, User } from '../../types/auth';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthStatus,
  selectIsAuthenticated,
  selectUser,
} from '../selectors/authSelectors';
import {
  clearError,
  loadUserData,
  login,
  logout,
  setLoading,
  updateUser,
} from '../slices/authSlice';

// Хук для работы с аутентификацией
export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const authStatus = useAppSelector(selectAuthStatus);

  // Действия
  const loadUser = useCallback(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  const loginUser = useCallback(
    (response: AuthResponse) => {
      return dispatch(login(response));
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    return dispatch(logout());
  }, [dispatch]);

  const updateUserData = useCallback(
    (updatedUser: User) => {
      return dispatch(updateUser(updatedUser));
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setAuthLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  return {
    // Состояние
    user,
    isAuthenticated,
    isLoading,
    error,
    authStatus,

    // Действия
    loadUser,
    login: loginUser,
    logout: logoutUser,
    updateUser: updateUserData,
    clearError: clearAuthError,
    setLoading: setAuthLoading,
  };
};
