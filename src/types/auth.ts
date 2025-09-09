export interface AuthState {
  phoneNumber: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  handleLogin: () => Promise<void>;
  handleRegistration: () => Promise<void>;
  handleForgotPassword: () => void;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegistrationCredentials {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface User {
  id: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  client?: User;
}
