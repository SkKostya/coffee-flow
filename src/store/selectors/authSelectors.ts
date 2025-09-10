import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Базовые селекторы
const selectAuthState = (state: RootState) => state.auth;

// Селекторы для auth
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.isLoading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

// Комбинированные селекторы
export const selectAuthStatus = createSelector(
  [selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError],
  (user, isAuthenticated, isLoading, error) => ({
    user,
    isAuthenticated,
    isLoading,
    error,
  })
);
