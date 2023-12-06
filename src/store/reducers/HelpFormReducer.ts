import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IHelpFormState, IHelpFormRequest, IError } from '../../components/types';

const initialState: IHelpFormState = {
  userName: '',
  email: '',
  title: '',
  reason: '',
  address: null,
  isLoading: false,
  error: null,
};

export const HelpFormReducer = createSlice({
  name: 'HelpFormReducer',
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
    helpFormReducerError: (state, { payload }: PayloadAction<IError>): IHelpFormState => {
      return { ...state, isLoading: false, error: payload };
    },
    helpFormClear: (state): IHelpFormState => {
      return initialState;
    },
  },
});

export const { helpFormReducerStart, helpFormReducerSuccess, helpFormReducerError, helpFormClear } =
  HelpFormReducer.actions;

export default HelpFormReducer.reducer;
