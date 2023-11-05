export interface IError {
  type: 'email' | 'userName' | 'password';
  error: string;
}

export interface StoreState {
  AuthReducer: IAuthState;
  RegReducer: IRegState;
}

export interface IAuthState {
  login: string;
  password: string;
  error: IError[] | null;
  isLoading: boolean;
}

export type IAuthRequest = Omit<IAuthState, 'error' | 'isLoading'>;

export interface IRegState {
  userName: string;
  email: string;
  password: string;
  error: IError[] | null;
  isLoading: boolean;
}

export type IRegRequest = Omit<IRegState, 'error' | 'isLoading'>;
