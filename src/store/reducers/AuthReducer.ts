import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IAuthState, IError, IAuthGoodResponse } from '../../components/types';

const initialState: IAuthState = {
  user_id: 0,
  access: null,
  error: null,
  isLoading: false,
};

export const AuthReducer = createSlice({
  name: 'AuthReducer',
  initialState,
  reducers: {
    loginStart: (state) => {
      return { ...state, isLoading: true, error: null };
    },
    addAccess: (state, { payload }: PayloadAction<string | null>): IAuthState => {
      return { ...state, access: payload };
    },
    loginSuccess: (state, { payload }: PayloadAction<IAuthGoodResponse>): IAuthState => {
      return {
        ...state,
        user_id: payload.user_id,
        access: payload.access,
        error: null,
        isLoading: false,
      };
    },
    loginError: (state, { payload }: PayloadAction<IError>): IAuthState => {
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    },
    authClear: (state): IAuthState => {
      return initialState;
    },
  },
});

export const { loginStart, loginSuccess, loginError, addAccess, authClear } = AuthReducer.actions;

export default AuthReducer.reducer;
