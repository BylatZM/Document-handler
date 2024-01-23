import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IHelpFormState, IHelpFormRequest, IError } from '../../components/types';

const initHelpFormInfo: IHelpFormRequest = {
  name: '',
  contact: '',
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
    helpFormContact: (state, { payload }: PayloadAction<string>) => {
      state.info.contact = payload;
    },
    helpFormName: (state, { payload }: PayloadAction<string>) => {
      state.info.name = payload;
    },
    helpFormAddress: (state, { payload }: PayloadAction<string>) => {
      state.info.address = payload;
    },
    helpFormPossessions: (state, { payload }: PayloadAction<string[] | null>) => {
      state.processed_possessions = payload;
    },
    helpFormInfoSuccess: (state, { payload }: PayloadAction<IHelpFormRequest>): IHelpFormState => {
      return { ...state, info: { ...payload }, isLoading: false };
    },
    helpFormError: (state, { payload }: PayloadAction<IError | null>): IHelpFormState => {
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
  helpFormContact,
  helpFormClear,
  helpFormName,
  helpFormAddress,
  helpFormInfoSuccess,
  helpFormPossessions,
} = HelpFormReducer.actions;

export default HelpFormReducer.reducer;
