import { useCallback } from 'react';
import {
  ChangePasswordRequest,
  DeleteAccountRequest,
  UpdateProfileRequest,
} from '../../profile/types/api';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectIsProfileLoaded,
  selectProfile,
  selectProfileError,
  selectProfileLoading,
  selectProfileStatus,
  selectUserEmail,
  selectUserFullName,
  selectUserPhone,
} from '../selectors/profileSelectors';
import {
  changePassword,
  clearError,
  clearProfile,
  deleteAccount,
  loadProfile,
  setLoading,
  updateProfile,
} from '../slices/profileSlice';

// Хук для работы с профилем
export const useProfile = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const profile = useAppSelector(selectProfile);
  const isLoading = useAppSelector(selectProfileLoading);
  const error = useAppSelector(selectProfileError);
  const profileStatus = useAppSelector(selectProfileStatus);
  const fullName = useAppSelector(selectUserFullName);
  const email = useAppSelector(selectUserEmail);
  const phone = useAppSelector(selectUserPhone);
  const isLoaded = useAppSelector(selectIsProfileLoaded);

  // Действия
  const loadUserProfile = useCallback(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  const updateUserProfile = useCallback(
    (data: UpdateProfileRequest) => {
      return dispatch(updateProfile(data));
    },
    [dispatch]
  );

  const changeUserPassword = useCallback(
    (data: ChangePasswordRequest) => {
      return dispatch(changePassword(data));
    },
    [dispatch]
  );

  const deleteUserAccount = useCallback(
    (data: DeleteAccountRequest) => {
      return dispatch(deleteAccount(data));
    },
    [dispatch]
  );

  const clearProfileError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearUserProfile = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  const setProfileLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  return {
    // Состояние
    profile,
    isLoading,
    error,
    profileStatus,
    fullName,
    email,
    phone,
    isLoaded,

    // Действия
    loadProfile: loadUserProfile,
    updateProfile: updateUserProfile,
    changePassword: changeUserPassword,
    deleteAccount: deleteUserAccount,
    clearError: clearProfileError,
    clearProfile: clearUserProfile,
    setLoading: setProfileLoading,
  };
};
