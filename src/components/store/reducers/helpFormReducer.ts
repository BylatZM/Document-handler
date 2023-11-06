import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IHelpFormState, IHelpFormRequest, IError } from '../../types';

const initialState: IHelpFormState = {
  userName: '',
  email: '',
  title: '',
  reason: '',
  address: null,
  isLoading: false,
  error: null,
};

export const helpFormReducer = createSlice({
  name: 'helpFormReducer',
  initialState,
  reducers: {
    helpFormReducerStart: (state): IHelpFormState => {
      return { ...state, isLoading: true, error: null };
    },
    helpFormReducerSuccess: (
      state,
      { payload }: PayloadAction<IHelpFormRequest>,
    ): IHelpFormState => {
      return {
        userName: payload.userName,
        email: payload.email,
        title: payload.title,
        reason: payload.reason,
        address: payload.address,
        isLoading: false,
        error: null,
      };
    },
    helpFormReducerError: (state, { payload }: PayloadAction<IError[]>): IHelpFormState => {
      return { ...state, isLoading: false, error: payload };
    },
  },
});

export const { helpFormReducerStart, helpFormReducerSuccess, helpFormReducerError } =
  helpFormReducer.actions;

export default helpFormReducer.reducer;
