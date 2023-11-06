export interface IError {
  type: string;
  error: string;
}

export interface StoreState {
  AuthReducer: IAuthState;
  RegReducer: IRegState;
  HelpFormReducer: IHelpFormState;
}

export interface IAuthState {
  email: string;
  password: string;
  error: IError[] | null;
  isLoading: boolean;
}

export interface IHelpFormState {
  userName: string;
  email: string;
  title: string;
  reason: string;
  address: string | null;
  isLoading: boolean;
  error: IError[] | null;
}

export type IAuthRequest = Omit<IAuthState, 'error' | 'isLoading'>;

export interface IRegState {
  name: string;
  surName: string;
  email: string;
  password: string;
  error: IError[] | null;
  isLoading: boolean;
}

export type IRegRequest = Omit<IRegState, 'error' | 'isLoading'> & {
  patronymic: null;
  phone: null;
};

export type IHelpFormRequest = Omit<IHelpFormState, 'error' | 'isLoading'>;
