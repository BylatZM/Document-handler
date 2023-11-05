import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IAuthState, IAuthRequest, IError } from '../../types';

const initialState: IAuthState = {
  login: '',
  password: '',
  error: null,
  isLoading: false,
};

export const authReducer = createSlice({
  name: 'authReducer',
  initialState,
  reducers: {
    loginStart: (state) => {
      return { ...state, isLoading: true, error: null };
    },
    loginSuccess: (state, { payload }: PayloadAction<IAuthRequest>): IAuthState => {
      return {
        ...state,
        login: payload.login,
        password: payload.password,
        error: null,
        isLoading: false,
      };
    },
    loginError: (state, { payload }: PayloadAction<IError[]>): IAuthState => {
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    },
  },
});

export const { loginStart, loginSuccess, loginError } = authReducer.actions;

export default authReducer.reducer;
