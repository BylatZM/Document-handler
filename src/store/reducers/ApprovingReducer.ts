import {
  IApprovingLoading,
  IApprovingState,
  INotApprovedCitizenPossession,
  INotApprovedLivingSpace,
} from './../../components/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { IError } from '../../components/types';

const initialState: IApprovingState = {
  approvingLivingSpaces: [],
  approvingCitizenPossessions: [],
  error: null,
  isLoading: null,
};

export const ApprovingReducer = createSlice({
  name: 'ApprovingReducer',
  initialState,
  reducers: {
    approvingLoading: (state, { payload }: PayloadAction<IApprovingLoading>) => {
      state.isLoading = payload;
    },
    approvingCitizenPossessionsSuccess: (
      state,
      { payload }: PayloadAction<INotApprovedCitizenPossession[]>,
    ) => {
      state.approvingCitizenPossessions = payload;
      state.isLoading = null;
    },
    approvingLivingSpacesSuccess: (
      state,
      { payload }: PayloadAction<INotApprovedLivingSpace[]>,
    ) => {
      state.approvingLivingSpaces = payload;
      state.isLoading = null;
    },
    approvingError: (state, { payload }: PayloadAction<IError | null>) => {
      state.error = payload;
    },
    approvingClear: (state): IApprovingState => {
      return initialState;
    },
  },
});

export const {
  approvingClear,
  approvingError,
  approvingLivingSpacesSuccess,
  approvingCitizenPossessionsSuccess,
  approvingLoading,
} = ApprovingReducer.actions;

export default ApprovingReducer.reducer;
