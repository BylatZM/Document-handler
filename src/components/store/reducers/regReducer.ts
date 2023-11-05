import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IRegState, IRegRequest, IError } from '../../types';

const initialState: IRegState = {
  userName: '',
  email: '',
  password: '',
  error: null,
  isLoading: false,
};

export const regReducer = createSlice({
  name: 'regReducer',
  initialState,
  reducers: {
    regStart: (state): IRegState => {
      return { ...state, isLoading: true, error: null };
    },
    regSuccess: (state, { payload }: PayloadAction<IRegRequest>): IRegState => {
      return {
        ...state,
        userName: payload.userName,
        password: payload.password,
        email: payload.email,
        isLoading: false,
        error: null,
      };
    },
    regError: (state, { payload }: PayloadAction<IError[]>): IRegState => {
      return { ...state, isLoading: false, error: payload };
    },
  },
});

export const { regStart, regSuccess, regError } = regReducer.actions;

export default regReducer.reducer;
