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
  ISubtype,
  IGisApplication,
} from '../../components/types';

const initialState: IApplicationState = {
  applications: [],
  gisApplications: [],
  types: [],
  grades: [],
  sources: [],
  statuses: [],
  employs: [],
  priorities: [],
  error: null,
  isLoading: false,
  subtypes: [],
};

export const ApplicationReducer = createSlice({
  name: 'ApplicationReducer',
  initialState,
  reducers: {
    applicationLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    applicationSuccess: (state, { payload }: PayloadAction<IApplication[]>) => {
      state.applications = payload;
      state.isLoading = false;
    },
    gisApplicationSuccess: (state, { payload }: PayloadAction<IGisApplication[]>) => {
      state.gisApplications = payload;
      state.isLoading = false;
    },
    typesSuccess: (state, { payload }: PayloadAction<IType[]>) => {
      state.types = payload;
    },
    gradesSuccess: (state, { payload }: PayloadAction<IGrade[]>) => {
      state.grades = payload;
    },
    subTypesSuccess: (state, { payload }: PayloadAction<ISubtype[]>) => {
      state.subtypes = payload;
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
    applicationError: (state, { payload }: PayloadAction<IError | null>) => {
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
