export interface AuthState {
  phoneNumber: string;
  password: string;
}

export interface AuthActions {
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  handleLogin: () => void;
  handleRegistration: () => void;
  handleForgotPassword: () => void;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    phoneNumber: string;
    name?: string;
  };
}
