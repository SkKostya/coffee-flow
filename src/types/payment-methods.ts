// src/types/payment-methods.ts

export interface PaymentMethod {
  id: string;
  type: 'card';
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  isDefault: boolean;
  isActive: boolean;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodRequest {
  type: 'card';
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  isDefault: boolean;
}

export interface UpdatePaymentMethodRequest {
  type: 'card';
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  isDefault: boolean;
}

export interface PaymentMethodsState {
  methods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

export interface PaymentMethodFormData {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  isDefault: boolean;
}

// Utility types
export type PaymentMethodId = string;

export interface PaymentMethodActions {
  loadPaymentMethods: () => Promise<void>;
  createPaymentMethod: (data: CreatePaymentMethodRequest) => Promise<void>;
  updatePaymentMethod: (
    id: PaymentMethodId,
    data: UpdatePaymentMethodRequest
  ) => Promise<void>;
  deletePaymentMethod: (id: PaymentMethodId) => Promise<void>;
  setDefaultPaymentMethod: (id: PaymentMethodId) => Promise<void>;
  clearError: () => void;
}

// API Response types
export interface PaymentMethodsResponse {
  data: PaymentMethod[];
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaymentMethodResponse {
  data: PaymentMethod;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaymentMethodError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}
