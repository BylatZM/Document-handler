import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IHelpFormState, IHelpFormRequest, IError } from '../../components/types';

const initHelpFormInfo: IHelpFormRequest = {
  name: '',
  email: '',
  title: '',
  description: '',
  address: '',
};

const initialState: IHelpFormState = {
  info: initHelpFormInfo,
  processed_possessions: null,
  isLoading: false,
  error: null,
};

export const HelpFormReducer = createSlice({
  name: 'HelpFormReducer',
  initialState,
  reducers: {
    helpFormLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    helpFormInit: (
      state,
      { payload }: PayloadAction<{ name: string; email: string; posses: string[] | null }>,
    ) => {
      state.info.name = payload.name;
      state.info.email = payload.email;
      state.processed_possessions = payload.posses;
    },
    helpFormInfoSuccess: (state, { payload }: PayloadAction<IHelpFormRequest>): IHelpFormState => {
      return { ...state, info: { ...payload } };
    },
    helpFormError: (state, { payload }: PayloadAction<IError>): IHelpFormState => {
      return { ...state, isLoading: false, error: payload };
    },
    helpFormClear: (state): IHelpFormState => {
      return initialState;
    },
  },
});

export const { helpFormLoading, helpFormError, helpFormClear, helpFormInit, helpFormInfoSuccess } =
  HelpFormReducer.actions;

export default HelpFormReducer.reducer;
