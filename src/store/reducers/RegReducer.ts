import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IRegState, IError, IRegRequest } from '../../components/types';

const initialState: IRegState = {
  email: '',
  isLoading: false,
  error: null,
};

export const RegReducer = createSlice({
  name: 'RegReducer',
  initialState,
  reducers: {
    regLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    regSuccess: (state, { payload }: PayloadAction<IRegRequest>) => {
      state.email = payload.email;
      state.error = null;
    },
    regError: (state, { payload }: PayloadAction<IError>) => {
      state.error = payload;
    },
    regClear: (state): IRegState => {
      return initialState;
    },
  },
});

export const { regSuccess, regClear, regLoading, regError } = RegReducer.actions;

export default RegReducer.reducer;
