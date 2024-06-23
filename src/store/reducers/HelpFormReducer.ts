import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IHelpFormState, IError } from '../../components/types';

const initialState: IHelpFormState = {
  processedPossessions: null,
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
    helpFormPossessions: (state, { payload }: PayloadAction<string[] | null>) => {
      state.processedPossessions = payload;
    },
    helpFormError: (state, { payload }: PayloadAction<IError | null>): IHelpFormState => {
      return { ...state, isLoading: false, error: payload };
    },
    helpFormClear: (state): IHelpFormState => {
      return initialState;
    },
  },
});

export const { helpFormLoading, helpFormError, helpFormClear, helpFormPossessions } =
  HelpFormReducer.actions;

export default HelpFormReducer.reducer;
