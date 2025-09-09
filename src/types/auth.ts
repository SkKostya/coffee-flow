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

export interface RegistrationCredentials {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  name: string; // computed field: firstName + lastName
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}
