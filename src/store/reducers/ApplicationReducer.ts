import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  IApplicationState,
  IError,
  IApplication,
  IType,
  IGrade,
  IPriority,
  ISource,
  IStatus,
  IEmployee,
  ISubType,
} from '../../components/types';

const initialState: IApplicationState = {
  userApplication: [],
  types: [],
  grades: [],
  sources: [],
  statuses: [],
  employs: [],
  priorities: [],
  error: null,
  isLoading: false,
  subTypes: [],
};

export const ApplicationReducer = createSlice({
  name: 'ApplicationReducer',
  initialState,
  reducers: {
    applicationLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    applicationSuccess: (state, { payload }: PayloadAction<IApplication[]>) => {
      state.userApplication = payload;
      state.isLoading = false;
    },
    typesSuccess: (state, { payload }: PayloadAction<IType[]>) => {
      state.types = payload;
    },
    gradesSuccess: (state, { payload }: PayloadAction<IGrade[]>) => {
      state.grades = payload;
    },
    subTypesSuccess: (state, { payload }: PayloadAction<ISubType[]>) => {
      state.subTypes = payload;
    },
    prioritySuccess: (state, { payload }: PayloadAction<IPriority[]>) => {
      state.priorities = payload;
    },
    sourcesSuccess: (state, { payload }: PayloadAction<ISource[]>) => {
      state.sources = payload;
    },
    statusesSuccess: (state, { payload }: PayloadAction<IStatus[]>) => {
      state.statuses = payload;
    },
    employsSuccess: (state, { payload }: PayloadAction<IEmployee[]>) => {
      state.employs = payload;
    },
    updateApplication: (
      state,
      { payload }: PayloadAction<{ app_id: number; application: IApplication }>,
    ) => {
      state.userApplication = state.userApplication.filter((el) => el.id !== payload.app_id);
      state.userApplication.push(payload.application);
    },
    applicationError: (state, { payload }: PayloadAction<IError>) => {
      state.error = payload;
    },
    applicationClear: (state): IApplicationState => {
      return initialState;
    },
  },
});

export const {
  applicationLoading,
  applicationSuccess,
  updateApplication,
  applicationError,
  applicationClear,
  employsSuccess,
  sourcesSuccess,
  statusesSuccess,
  typesSuccess,
  gradesSuccess,
  prioritySuccess,
  subTypesSuccess,
} = ApplicationReducer.actions;

export default ApplicationReducer.reducer;
