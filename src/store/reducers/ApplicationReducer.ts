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
} from '../../components/types';

const initialState: IApplicationState = {
  userApplication: [],
  types: null,
  grades: null,
  sources: null,
  statuses: null,
  employs: null,
  priorities: null,
  error: null,
  isLoading: false,
};

export const ApplicationReducer = createSlice({
  name: 'ApplicationReducer',
  initialState,
  reducers: {
    applicationStart: (state) => {
      state.isLoading = true;
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
      state.isLoading = false;
    },
    applicationClear: (state): IApplicationState => {
      return initialState;
    },
  },
});

export const {
  applicationStart,
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
} = ApplicationReducer.actions;

export default ApplicationReducer.reducer;
