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
    helpFormEmail: (state, { payload }: PayloadAction<string>) => {
      state.info.email = payload;
    },
    helpFormName: (state, { payload }: PayloadAction<string>) => {
      state.info.name = payload;
    },
    helpFormPossessions: (state, { payload }: PayloadAction<string[] | null>) => {
      state.processed_possessions = payload;
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

export const {
  helpFormLoading,
  helpFormError,
  helpFormEmail,
  helpFormClear,
  helpFormName,
  helpFormInfoSuccess,
  helpFormPossessions,
} = HelpFormReducer.actions;

export default HelpFormReducer.reducer;
