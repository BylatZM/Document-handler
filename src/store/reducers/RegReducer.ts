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
    regStart: (state) => {
      state.isLoading = true;
    },
    regSuccess: (state, { payload }: PayloadAction<IRegRequest>) => {
      state.email = payload.email;
      state.isLoading = false;
      state.error = null;
    },
    regError: (state, { payload }: PayloadAction<IError>) => {
      state.error = payload;
      state.isLoading = false;
    },
    regClear: (state): IRegState => {
      return initialState;
    },
  },
});

export const { regSuccess, regClear, regStart, regError } = RegReducer.actions;

export default RegReducer.reducer;
