// Базовые типы для Redux store

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncThunkConfig {
  state: any; // Будет заменено на RootState после создания store
  dispatch: any; // Будет заменено на AppDispatch
  rejectValue: string;
}
