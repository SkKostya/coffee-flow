import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Базовые селекторы
const selectProfileState = (state: RootState) => state.profile;

// Селекторы для profile
export const selectProfile = createSelector(
  [selectProfileState],
  (profile) => profile.profile
);

export const selectProfileLoading = createSelector(
  [selectProfileState],
  (profile) => profile.isLoading
);

export const selectProfileError = createSelector(
  [selectProfileState],
  (profile) => profile.error
);

// Комбинированные селекторы
export const selectProfileStatus = createSelector(
  [selectProfile, selectProfileLoading, selectProfileError],
  (profile, isLoading, error) => ({
    profile,
    isLoading,
    error,
  })
);

// Селекторы для конкретных полей профиля
export const selectUserFullName = createSelector([selectProfile], (profile) => {
  if (!profile) return '';
  return `${profile.firstName} ${profile.lastName}`.trim();
});

export const selectUserEmail = createSelector(
  [selectProfile],
  (profile) => profile?.email || ''
);

export const selectUserPhone = createSelector(
  [selectProfile],
  (profile) => profile?.phoneNumber || ''
);

export const selectIsProfileLoaded = createSelector(
  [selectProfile],
  (profile) => profile !== null
);
